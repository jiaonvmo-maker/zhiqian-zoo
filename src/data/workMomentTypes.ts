/** 「干一天试试」沉浸式体验 · 类型定义 */

/** 入职前学习建议：must=必学 nice=了解即可 aware=知道名字 */
export type LearnLevel = 'must' | 'nice' | 'aware';

export interface JargonItem {
  term: string;
  plain: string;
}

/** 行业黑话 / 流程术语 */
export interface TermItem {
  term: string;
  plain: string;
  /** 在协作链上的位置，可选 */
  chain?: string;
}

/** 软件 / 平台工具卡片 */
export interface ToolItem {
  name: string;
  icon: string;
  what: string;
  who: string;
  today: string;
  learn: LearnLevel;
  learnTip: string;
  alt?: string;
}

export interface DayFlowItem {
  time: string;
  title: string;
  desc: string;
}

export interface MomentPing {
  from: string;
  text: string;
  time?: string;
}

export interface MomentChoice {
  label: string;
  youSay: string;
  reply?: { from: string; text: string };
  thought: string;
  teach?: string;
  next?: number;
}

/** 动效示意图 ID — 组件内实现对应 mock UI */
export type StepVisualId = 'dau-dashboard' | 'push-funnel' | 'figma-workspace';

export interface StepVisual {
  id: StepVisualId;
  /** 图下方一句话说明 */
  caption: string;
  /** 高亮提示，如「DAU 在这里看」 */
  hint?: string;
}

export interface MomentStep {
  phase: string;
  phaseTip: string;
  /** @deprecated 用 terms + tools 替代；保留兼容旧数据 */
  jargon?: JargonItem[];
  terms?: TermItem[];
  tools?: ToolItem[];
  /** 顺滑动效 mock：帮零基础理解「在哪看、长啥样」 */
  visual?: StepVisual;
  pings: MomentPing[];
  choices: MomentChoice[];
  endTag?: string;
}

export interface WorkMomentSummary {
  processRecap: string;
  keyJargon: JargonItem[];
  toolbox?: ToolItem[];
  selfCheck: string[];
  verdictHint: string;
}

export interface WorkMoment {
  deptId: string;
  title: string;
  when: string;
  role: string;
  oneLiner: string;
  /** 场景说明，如「模拟中大型互联网公司」 */
  sceneNote?: string;
  dayFlow: DayFlowItem[];
  /** 开场预览：今天会碰到的软件 */
  introTools?: ToolItem[];
  mightLike: string[];
  mightStruggle: string[];
  steps: MomentStep[];
  summary: WorkMomentSummary;
}

export const LEARN_LABELS: Record<LearnLevel, string> = {
  must: '入职前必学',
  nice: '了解即可',
  aware: '知道名字',
};

export const LEARN_COLORS: Record<LearnLevel, string> = {
  must: '#e85d4c',
  nice: '#d4a017',
  aware: '#999',
};
