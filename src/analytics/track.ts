import type { AppPhase } from '@/types';
import { AnalyticsEvents, type AnalyticsEventName } from './events';
import { appendLocalEvent } from './localStore';
import { getDistinctId, getSessionId, getViewport, markSessionStarted } from './session';

type EventProps = Record<string, string | number | boolean | string[] | null | undefined>;

let surveyTitle: string | undefined;
let surveyTraits: string[] | undefined;

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY?.trim() || '';
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com').replace(/\/$/, '');
const WEBHOOK_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim() || '';
const DEBUG = import.meta.env.VITE_ANALYTICS_DEBUG === 'true';

function baseProps(phase?: AppPhase): EventProps {
  return {
    session_id: getSessionId(),
    distinct_id: getDistinctId(),
    timestamp: Date.now(),
    platform: 'web',
    viewport: getViewport(),
    base_path: import.meta.env.BASE_URL,
    phase: phase ?? null,
    has_survey_profile: Boolean(surveyTitle),
    survey_title: surveyTitle ?? null,
    survey_traits: surveyTraits ?? null,
  };
}

function postJson(url: string, body: Record<string, unknown>, cors = false) {
  const payload = JSON.stringify(body);
  try {
    if (!cors && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      if (navigator.sendBeacon(url, payload)) return;
    }
  } catch {
    /* fallback */
  }
  void fetch(url, cors
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }
    : {
        method: 'POST',
        body: payload,
        keepalive: true,
        mode: 'no-cors' as RequestMode,
      }).catch(() => {});
}

function sendToPostHog(event: string, properties: EventProps) {
  if (!POSTHOG_KEY) return;
  postJson(`${POSTHOG_HOST}/capture/`, {
    api_key: POSTHOG_KEY,
    event,
    distinct_id: getDistinctId(),
    properties: { ...properties, $lib: 'pa-analytics' },
    timestamp: new Date().toISOString(),
  });
}

function sendToWebhook(event: string, properties: EventProps) {
  if (!WEBHOOK_ENDPOINT) return;
  postJson(WEBHOOK_ENDPOINT, { event, ...properties });
}

/** 上报事件 — 后台静默，用户无感知 */
export function track(event: AnalyticsEventName | string, props: EventProps = {}, phase?: AppPhase) {
  const payload = { ...baseProps(phase), ...props };

  appendLocalEvent(event, payload);

  if (DEBUG) {
    console.info('[analytics]', event, payload);
  }

  sendToPostHog(event, payload);
  sendToWebhook(event, payload);
}

export function identifySurveyProfile(title: string, traits: string[]) {
  surveyTitle = title;
  surveyTraits = traits;

  if (!POSTHOG_KEY) return;

  postJson(`${POSTHOG_HOST}/capture/`, {
    api_key: POSTHOG_KEY,
    event: '$identify',
    distinct_id: getDistinctId(),
    properties: { $set: { survey_title: title, survey_traits: traits } },
    timestamp: new Date().toISOString(),
  });
}

export function initAnalytics(phase: AppPhase = 'entry') {
  if (!markSessionStarted()) return;
  track(AnalyticsEvents.SESSION_START, { entry_phase: phase }, phase);
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(POSTHOG_KEY || WEBHOOK_ENDPOINT);
}

export function getAnalyticsViewerUrl(): string | null {
  if (!WEBHOOK_ENDPOINT) return null;
  const m = WEBHOOK_ENDPOINT.match(/webhook\.site\/([a-f0-9-]+)/i);
  return m ? `https://webhook.site/#!/${m[1]}` : null;
}

export { AnalyticsEvents };
