const UID_KEY = 'pa_analytics_uid';
const SID_KEY = 'pa_analytics_sid';
const SESSION_STARTED_KEY = 'pa_session_started';

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

/** 匿名用户 ID — 跨会话持久化 */
export function getDistinctId(): string {
  try {
    let id = localStorage.getItem(UID_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(UID_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

/** 单次访问会话 ID */
export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SID_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

export function markSessionStarted(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_STARTED_KEY)) return false;
    sessionStorage.setItem(SESSION_STARTED_KEY, '1');
    return true;
  } catch {
    return true;
  }
}

export function getViewport(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < 640 ? 'mobile' : 'desktop';
}
