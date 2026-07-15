const MAX_EVENTS = 300;
const STORAGE_KEY = 'pa_analytics_log';

export interface StoredEvent {
  event: string;
  properties: Record<string, unknown>;
  at: number;
}

export function appendLocalEvent(event: string, properties: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ event, properties, at: Date.now() });
    while (list.length > MAX_EVENTS) list.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readLocalEvents(): StoredEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearLocalEvents() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** 从本地日志计算简易漏斗 */
export function computeFunnel(events: StoredEvent[]) {
  const names = events.map((e) => e.event);
  const has = (n: string) => names.includes(n);
  return {
    session_start: names.filter((n) => n === 'session_start').length,
    survey_complete: has('survey_complete'),
    floor_select: names.filter((n) => n === 'floor_select').length,
    work_moment_complete: has('work_moment_complete'),
    chat_message_send: names.filter((n) => n === 'chat_message_send').length,
  };
}
