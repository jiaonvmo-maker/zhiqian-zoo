import type { SurveyQuestion, MetaIdea } from '@/types';
import { deptMascot } from './partyAnimalsAssets';

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'q1',
    question: '你更适应哪种工作节律？',
    options: ['外部 deadline 驱动，节奏明确', '自主安排节奏，深度琢磨'],
    traits: ['行动派', '慢工派'],
  },
  {
    id: 'q2',
    question: '面对未知选项，你的决策习惯是？',
    options: ['列维度打分，理性比较', '凭直觉，顺眼就先试'],
    traits: ['理性派', '直觉派'],
  },
  {
    id: 'q3',
    question: '理想的工作日常，能量来自哪里？',
    options: ['与人协作、跨团队推进', '独立攻坚、在一个领域扎深'],
    traits: ['社交派', '深耕派'],
  },
];

export const titleMap: Record<string, string> = {
  '行动派+理性派+社交派': '跨界协调型 · 产品/运营向',
  '行动派+理性派+深耕派': '工程自洽型 · 技术/数据向',
  '行动派+直觉派+社交派': '增长驱动型 · 运营/商务向',
  '行动派+直觉派+深耕派': '单点突破型 · 设计/技术向',
  '慢工派+理性派+社交派': '洞察分析型 · 战略/数据向',
  '慢工派+理性派+深耕派': '深度钻研型 · 研发/法务向',
  '慢工派+直觉派+社交派': '体验感知型 · 设计/支持向',
  '慢工派+直觉派+深耕派': '稳健深耕型 · 财务/行政向',
};

export const tagPresets = [
  '信息整合能力强',
  '抗压但不爱卷',
  '细节敏感型',
  '宏观视野偏好',
  '跨界学习意愿高',
  '单点深度偏好',
  '协作能量型',
  '独立产出型',
];

export const initialMetaIdeas: MetaIdea[] = [
  {
    id: 'idea-1',
    userName: '野生应届生',
    userAvatar: deptMascot.product,
    title: '行业盲盒体验日',
    description: '随机抽一个部门，按职级分层体验一天——从实习生到总监各干什么',
    likes: 128,
    bookmarks: 45,
    status: 'dev',
    progress: 60,
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'idea-2',
    userName: '迷茫文科生',
    userAvatar: deptMascot.tech,
    title: '文科生职业路径图谱',
    description: '按能力维度拆解：内容、运营、产品、商务、战略，各自日常与晋升路径',
    likes: 256,
    bookmarks: 89,
    status: 'done',
    progress: 100,
    timestamp: Date.now() - 86400000 * 7,
  },
  {
    id: 'idea-3',
    userName: '纠结怪本怪',
    userAvatar: deptMascot.operation,
    title: '产品 vs 运营 职级对照',
    description: '同一职级下，两个岗位的日常差异——用场景题帮你分清楚',
    likes: 67,
    bookmarks: 23,
    status: 'voting',
    progress: 0,
    timestamp: Date.now() - 86400000 * 1,
  },
  {
    id: 'idea-4',
    userName: '考研还是工作',
    userAvatar: deptMascot.design,
    title: '读研 ROI 沙盘',
    description: '输入专业与目标行业，对比三年后各职级的发展曲线',
    likes: 34,
    bookmarks: 12,
    status: 'dead',
    progress: 10,
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: 'idea-5',
    userName: 'HR小姐姐',
    userAvatar: deptMascot.hr,
    title: 'JD 关键词解码器',
    description: '把「负责统筹」「具备全局视野」翻译成真实日常与职级要求',
    likes: 199,
    bookmarks: 77,
    status: 'dev',
    progress: 35,
    timestamp: Date.now() - 86400000 * 2,
  },
];
