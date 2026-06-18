import type { CareerTierLevel } from '@/types';

/**
 * 2024–2025 校招 / 社招初段参考区间（一线 T1 为锚点）
 * 综合自：公开校招 JD、脉脉/牛客年度盘点、猎聘研究院报告等，取中位带宽
 */

export type CityTier = 'tier1' | 'tier1_5' | 'tier2';
export type CompanyTier = 't1_platform' | 't2_unicorn' | 't3_mid' | 't4_growth' | 't5_early';

export interface CityOption {
  id: CityTier;
  label: string;
  hint: string;
}

export interface CompanyTierOption {
  id: CompanyTier;
  label: string;
  shortLabel: string;
  hint: string;
  examples: string;
  multiplier: number;
}

export interface SalaryTierRow {
  tier: CareerTierLevel;
  tierLabel: string;
  monthlyMin: number;
  monthlyMax: number;
  /** 实习生专用：元/天；其他职级为 null */
  dailyMin?: number;
  dailyMax?: number;
  bonus: string;
  note: string;
}

export interface DeptSalaryProfile {
  deptId: string;
  city: CityTier;
  companyTier: CompanyTier;
  deptMultiplier: number;
  companyMultiplier: number;
  highlight: string;
  companyContext: string;
  variablePay?: string;
  tiers: SalaryTierRow[];
}

export const COMPANY_TIER_OPTIONS: CompanyTierOption[] = [
  {
    id: 't1_platform',
    label: 'T1 头部平台',
    shortLabel: 'T1',
    hint: '上市巨头 / 万人规模',
    examples: '字节、腾讯、阿里、美团、拼多多、京东',
    multiplier: 1.0,
  },
  {
    id: 't2_unicorn',
    label: 'T2 准大厂',
    shortLabel: 'T2',
    hint: '独角兽 / 细分龙头',
    examples: '米哈游、Shein、得物、小红书、快手',
    multiplier: 0.93,
  },
  {
    id: 't3_mid',
    label: 'T3 中型厂',
    shortLabel: 'T3',
    hint: 'B 轮后 · 千级人数',
    examples: '垂直 SaaS、区域互联网、传统数字化',
    multiplier: 0.81,
  },
  {
    id: 't4_growth',
    label: 'T4 成长期',
    shortLabel: 'T4',
    hint: 'A–B 轮 · 百人团队',
    examples: '高速增长创业、新消费技术团队',
    multiplier: 0.71,
  },
  {
    id: 't5_early',
    label: 'T5 早期小微',
    shortLabel: 'T5',
    hint: '种子~A 轮 · <100 人',
    examples: '初创团队、工作室',
    multiplier: 0.58,
  },
];

export const CITY_OPTIONS: CityOption[] = [
  { id: 'tier1', label: '一线', hint: '北上深杭 · 总部岗' },
  { id: 'tier1_5', label: '新一线', hint: '成武南苏广 · 区域总部' },
  { id: 'tier2', label: '二线', hint: '省会 & 强二线 · 分支岗' },
];

const TIER_META: { tier: CareerTierLevel; label: string }[] = [
  { tier: 'intern', label: '实习生' },
  { tier: 'associate', label: '专员 +1' },
  { tier: 'senior', label: '高级 / 主管' },
  { tier: 'director', label: '总监' },
  { tier: 'executive', label: '负责人 / VP' },
];

/** T1 + 一线 + 研发序列 正式员工月薪基准（K）— 2024 校招后常态 */
const BASE_T1_TIER1_TECH_K: Record<Exclude<CareerTierLevel, 'intern'>, [number, number]> = {
  associate: [24, 32],
  senior: [36, 52],
  director: [58, 82],
  executive: [88, 130],
};

/** 实习生日薪（元/天）— T1 一线研发口径 */
const BASE_INTERN_DAILY: Record<CityTier, [number, number]> = {
  tier1: [450, 750],
  tier1_5: [350, 580],
  tier2: [280, 450],
};

const CITY_MULT: Record<CityTier, number> = {
  tier1: 1.0,
  tier1_5: 0.8,
  tier2: 0.67,
};

/** 相对研发序列的部门系数（2024–2025 市场） */
const DEPT_CONFIG: Record<
  string,
  {
    multiplier: number;
    highlight: string;
    variablePay?: string;
    tierNotes: Partial<Record<CareerTierLevel, string>>;
  }
> = {
  product: {
    multiplier: 0.94,
    highlight: '产品 P 序列，校招较研发低 1–2 档，总包看业务线',
    tierNotes: { associate: 'T1 校招产品 base 常见 22–28K，SP 档 +4–8K' },
  },
  tech: {
    multiplier: 1.0,
    highlight: '研发为定价锚点：后端 / 算法 / 基础架构最高',
    tierNotes: { associate: 'T1 开发校招 base 中位约 26–28K（2024 调整后）' },
  },
  data: {
    multiplier: 0.97,
    highlight: '数据分析 / 算法工程，略低于纯研发',
    tierNotes: { associate: '数分 22–28K，算法岗接近开发顶格' },
  },
  operation: {
    multiplier: 0.74,
    highlight: '运营低于产研，绩效与 GMV / 留存强相关',
    tierNotes: { associate: 'T1 运营校招 base 常见 15–20K' },
  },
  commercial: {
    multiplier: 0.68,
    highlight: '表格为底薪；销售总包看提成，波动极大',
    variablePay: '大客户销售总包可超同届产研，底薪仅占 40–60%',
    tierNotes: { associate: '校招销售底薪常见 12–18K，提成另算' },
  },
  design: {
    multiplier: 0.86,
    highlight: 'UX/UI 设计，游戏 / 消费赛道 T2 有溢价',
    tierNotes: { senior: '高级设计看作品集，年限权重低于研发' },
  },
  hr: {
    multiplier: 0.63,
    highlight: 'HR / HRBP 现金带宽窄，T1 招聘岗随 HC 波动',
    tierNotes: { associate: 'T1 HR 校招 base 常见 12–16K' },
  },
  finance: {
    multiplier: 0.69,
    highlight: '财务 / FP&A，CPA / 四大背景 +8–12%',
    tierNotes: { associate: 'T1 财务 14–20K，制造业 in-house 再低 15–20%' },
  },
  legal: {
    multiplier: 0.72,
    highlight: '法务合规，出海 / 数据合规方向需求高',
    tierNotes: { senior: 'T2 独角兽法务总监现金可接近 T1 同级' },
  },
  management: {
    multiplier: 0.96,
    highlight: '战略 / 管培，T1 总包高但淘汰率也高',
    tierNotes: { executive: 'GM 现金 + 对赌，表格仅反映固定部分' },
  },
  support: {
    multiplier: 0.56,
    highlight: '客服 / 支持，带宽最窄，晋升靠带组',
    tierNotes: { associate: 'T1 客服 base 常见 8–12K，含绩效' },
  },
};

const BONUS_BY_COMPANY: Record<CompanyTier, Record<CareerTierLevel, string>> = {
  t1_platform: {
    intern: '房补 / 餐补常见',
    associate: '15–16 薪 + 签字费（0–50K）+ RSU',
    senior: '16–17 薪 + 股票刷新',
    director: '17–19 薪 + 期权包',
    executive: '19–24 薪 + 长期激励',
  },
  t2_unicorn: {
    intern: '部分有转正答辩',
    associate: '14–16 薪 + 期权',
    senior: '15–17 薪 + 期权',
    director: '16–18 薪 + 期权',
    executive: '17–22 薪',
  },
  t3_mid: {
    intern: '补贴为主',
    associate: '13–14 薪',
    senior: '14–15 薪',
    director: '15–16 薪',
    executive: '16–18 薪',
  },
  t4_growth: {
    intern: '日薪或月补贴',
    associate: '12–13 薪 + 期权',
    senior: '13–14 薪 + 期权',
    director: '14–15 薪',
    executive: '15–17 薪 + 对赌',
  },
  t5_early: {
    intern: '低于市场价，换履历',
    associate: '11–12 薪 + 期权为主',
    senior: '12–13 薪 + 期权',
    director: '13–14 薪 + 核心期权',
    executive: '现金面议',
  },
};

const ANNUAL_MONTHS: Record<CompanyTier, Record<Exclude<CareerTierLevel, 'intern'>, number>> = {
  t1_platform: { associate: 15.5, senior: 16.5, director: 18, executive: 21 },
  t2_unicorn: { associate: 15, senior: 16, director: 17, executive: 19 },
  t3_mid: { associate: 13.5, senior: 14.5, director: 15.5, executive: 17 },
  t4_growth: { associate: 12.5, senior: 13.5, director: 14.5, executive: 16 },
  t5_early: { associate: 12, senior: 12.5, director: 13, executive: 14 },
};

const COMPANY_CONTEXT: Record<CompanyTier, string> = {
  t1_platform: '2023 年后普遍微调 base，总包仍看 15–16 薪 + 股票。校招分普通 / SP / SSP，同岗可差 30–40%。',
  t2_unicorn: '盈利业务线逼近 T1，探索业务线接近 T3。期权流动性取决于上市 / 并购预期。',
  t3_mid: '现金为主，期权可有可无。跳槽溢价 15–25% 较常见。',
  t4_growth: 'base 保守，HR 常用期权补差距。问清融资轮次、稀释和归属节奏。',
  t5_early: '现金带宽最窄。务必书面确认：期权比例、4 年归属、离职加速条款。',
};

const TIER_COMPANY_NOTES: Partial<Record<CompanyTier, Partial<Record<CareerTierLevel, string>>>> = {
  t1_platform: {
    associate: '2024 字节 / 腾讯 / 阿里开发校招 base 多落在 24–32K',
    intern: '暑期日常实习 500–800/天；日常实习 400–600/天',
  },
  t2_unicorn: {
    senior: '米哈游 / 游戏赛道研发可超 T1 同级 cash',
  },
  t4_growth: {
    associate: '「13 薪」包装常见，但 base 基数低于 T1 同岗 25–35%',
  },
  t5_early: {
    associate: '可能给出低于 T3 的 base + 较大期权比例',
  },
};

function scaleRange([min, max]: [number, number], mult: number): [number, number] {
  const lo = Math.max(1, Math.round(min * mult));
  const hi = Math.max(lo + 1, Math.round(max * mult));
  return [lo, hi];
}

function scaleDaily([min, max]: [number, number], mult: number): [number, number] {
  const lo = Math.max(100, Math.round(min * mult / 50) * 50);
  const hi = Math.max(lo + 50, Math.round(max * mult / 50) * 50);
  return [lo, hi];
}

function buildDeptProfile(deptId: string, city: CityTier, companyTier: CompanyTier): DeptSalaryProfile {
  const deptCfg = DEPT_CONFIG[deptId] ?? { multiplier: 1, highlight: '综合行业参考', tierNotes: {} };
  const companyCfg = COMPANY_TIER_OPTIONS.find((c) => c.id === companyTier)!;
  const payMult = CITY_MULT[city] * companyCfg.multiplier * deptCfg.multiplier;

  const tiers = TIER_META.map(({ tier, label }) => {
    const companyNote = TIER_COMPANY_NOTES[companyTier]?.[tier];
    const deptNote = deptCfg.tierNotes[tier];
    const note = companyNote ?? deptNote ?? deptCfg.highlight;

    if (tier === 'intern') {
      const internMult = companyCfg.multiplier * (city === 'tier1' ? 1 : CITY_MULT[city]);
      const [dailyMin, dailyMax] = scaleDaily(BASE_INTERN_DAILY[city], internMult * deptCfg.multiplier);
      return {
        tier,
        tierLabel: label,
        monthlyMin: 0,
        monthlyMax: 0,
        dailyMin,
        dailyMax,
        bonus: BONUS_BY_COMPANY[companyTier][tier],
        note,
      };
    }

    const [min, max] = scaleRange(BASE_T1_TIER1_TECH_K[tier], payMult);
    return {
      tier,
      tierLabel: label,
      monthlyMin: min,
      monthlyMax: max,
      bonus: BONUS_BY_COMPANY[companyTier][tier],
      note,
    };
  });

  return {
    deptId,
    city,
    companyTier,
    deptMultiplier: deptCfg.multiplier,
    companyMultiplier: companyCfg.multiplier,
    highlight: deptCfg.highlight,
    companyContext: COMPANY_CONTEXT[companyTier],
    variablePay: deptCfg.variablePay,
    tiers,
  };
}

export function getDeptSalary(deptId: string, city: CityTier, companyTier: CompanyTier): DeptSalaryProfile {
  return buildDeptProfile(deptId, city, companyTier);
}

export function getCompanyTierOption(id: CompanyTier): CompanyTierOption {
  return COMPANY_TIER_OPTIONS.find((c) => c.id === id)!;
}

export function formatSalaryRange(min: number, max: number): string {
  return `${min}–${max}K`;
}

export function formatTierPay(row: SalaryTierRow): string {
  if (row.tier === 'intern' && row.dailyMin != null && row.dailyMax != null) {
    return `${row.dailyMin}–${row.dailyMax} 元/天`;
  }
  return `${formatSalaryRange(row.monthlyMin, row.monthlyMax)} / 月`;
}

export function estimateAnnualPackage(row: SalaryTierRow, companyTier: CompanyTier): string {
  if (row.tier === 'intern') {
    if (row.dailyMin == null || row.dailyMax == null) return '按实习协议结算';
    const low = (row.dailyMin * 21) / 1000;
    const high = (row.dailyMax * 22) / 1000;
    return `满勤约 ${low.toFixed(1)}–${high.toFixed(1)}K / 月（21–22 天）`;
  }
  const months = ANNUAL_MONTHS[companyTier][row.tier];
  const low = Math.round(row.monthlyMin * months);
  const high = Math.round(row.monthlyMax * (months + 1));
  return `总包约 ${low}–${high}K / 年（${months} 薪口径）`;
}

export function compareAssociateAcrossCompanies(deptId: string): { company: CompanyTierOption; range: string }[] {
  return COMPANY_TIER_OPTIONS.map((c) => {
    const p = getDeptSalary(deptId, 'tier1', c.id);
    const row = p.tiers.find((t) => t.tier === 'associate')!;
    return { company: c, range: formatSalaryRange(row.monthlyMin, row.monthlyMax) };
  });
}

export const SALARY_DISCLAIMER =
  '2024–2025 参考区间，整理自公开校招 JD、行业薪酬报告与社区盘点，按 T1–T5 × 城市 × 部门估算。实际 offer 因职级、绩效、股票而异，仅供参考，不构成求职或薪酬决策依据。';

export const DATA_VINTAGE = '2024–2025';
