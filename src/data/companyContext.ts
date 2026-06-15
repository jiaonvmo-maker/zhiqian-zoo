/** 全站统一公司设定 — 各部门「干一天」共用同一产品语境 */

export const companyContext = {
  companyName: '摸鱼科技',
  companyTagline: '让记录生活再简单一点',
  productName: '记记 App',
  productDesc: '年轻人用的生活记录 + 内容社区 App，核心功能：发动态、看 Feed、个性化推送提醒',
  /** 当前季度全员在做的需求 — 各部门 workMoment 可引用 */
  currentSprint: {
    name: '推送策略优化',
    code: 'PUSH-2025-Q2',
    goal: '提升推送打开率，解决「前三天点击高、后面掉量」的问题',
    deadline: '本周五',
    pages: ['推送设置页', '推送预览页', '通知权限引导页'],
  },
  metrics: {
    dau: '128 万',
    pushOpenRate: '12.3%',
    problem: '推送功能上线第 3 天起打开率掉 40%',
  },
  stack: {
    collab: '飞书',
    design: 'Figma',
    dev: 'GitLab + Jira',
    data: '神策',
  },
} as const;

export type CompanyContext = typeof companyContext;

/** 设计部等部门 intro 用的公司名片文案 */
export function companyBrief(): string {
  const { companyName, productName, currentSprint } = companyContext;
  return `${companyName} · ${productName}  ·  本迭代：${currentSprint.name}（${currentSprint.code}）`;
}

/** 当前需求一句话 — 挂在小抄/群聊上下文 */
export function sprintOneLiner(): string {
  const { currentSprint, metrics } = companyContext;
  return `「${currentSprint.name}」：${currentSprint.goal}（DAU ${metrics.dau}，${metrics.problem}）`;
}
