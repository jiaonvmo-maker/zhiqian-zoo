/** Phase 1 埋点事件名 — 与产品漏斗对齐 */
export const AnalyticsEvents = {
  SESSION_START: 'session_start',
  PHASE_CHANGE: 'phase_change',
  ENTRY_BUTTON_CLICK: 'entry_button_click',
  ENTRY_EASTER_EGG: 'entry_easter_egg',
  SURVEY_ANSWER: 'survey_answer',
  SURVEY_COMPLETE: 'survey_complete',
  FLOOR_SELECT: 'floor_select',
  WORK_MOMENT_OPEN: 'work_moment_open',
  WORK_MOMENT_START: 'work_moment_start',
  WORK_MOMENT_COMPLETE: 'work_moment_complete',
  WORK_MOMENT_ABANDON: 'work_moment_abandon',
  CHAT_MESSAGE_SEND: 'chat_message_send',
  CHAT_HISTORY_SKIP: 'chat_history_skip',
  PRIVATE_CHAT_OPEN: 'private_chat_open',
  PRIVATE_CHAT_COMPLETE: 'private_chat_complete',
  SALARY_VIEW: 'salary_view',
  SALARY_FILTER_CHANGE: 'salary_filter_change',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
