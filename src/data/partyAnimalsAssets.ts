/** 猛兽派对风格角色资产 — 全站统一用 pa-* 毛绒动物 */

const BASE = '/images/avatars';

export const deptMascot: Record<string, string> = {
  management: `${BASE}/pa-gorilla.png`,
  legal: `${BASE}/pa-unicorn.png`,
  finance: `${BASE}/pa-panda.png`,
  design: `${BASE}/pa-cat.png`,
  product: `${BASE}/pa-corgi.png`,
  commercial: `${BASE}/pa-dog.png`,
  tech: `${BASE}/pa-dino.png`,
  data: `${BASE}/pa-fox.png`,
  operation: `${BASE}/pa-tiger.png`,
  hr: `${BASE}/pa-croc.png`,
  support: `${BASE}/pa-duck.png`,
};

/** 入口页展示的三只代表 */
export const entryShowcase = [
  { src: deptMascot.product, label: '产品' },
  { src: deptMascot.tech, label: '技术' },
  { src: deptMascot.operation, label: '运营' },
] as const;

export const defaultAvatar = deptMascot.product;

/** 按 NPC 昵称 / 角色匹配猛兽派对形象 */
const npcAvatarMap: Record<string, string> = {
  'pm-1': deptMascot.product,       // 柯基
  'pm-2': deptMascot.commercial,    // 柴柴
  'pm-3': deptMascot.finance,       // 熊猫
  'pm-4': deptMascot.support,       // 鹦鹉 → 鸭
  'dev-1': deptMascot.data,         // 浣熊 → 狐
  'dev-2': deptMascot.finance,      // 树懒 → 熊猫
  'qa-1': deptMascot.support,       // 啄木鸟 → 鸭
  'dev-4': deptMascot.commercial,   // 哈士奇
  'dev-5': deptMascot.tech,         // 海狸 → 恐龙
  'op-1': deptMascot.design,        // 兔兔 → 猫
  'op-2': deptMascot.data,          // 松鼠 → 狐
  'op-3': deptMascot.support,       // 鸭子
  'op-4': deptMascot.management,    // 猴子 → 猩猩
  'sales-1': deptMascot.operation,  // 狮子 → 虎
  'sales-2': deptMascot.commercial,   // 猪猪 → 狗
  'sales-3': deptMascot.data,       // 狐狸
  'design-1': deptMascot.design,    // 喵喵
  'design-2': deptMascot.design,
  'design-3': deptMascot.management,
  'design-4': deptMascot.finance,
  'hr-1': deptMascot.legal,         // 猫头鹰 → 独角兽
  'hr-2': deptMascot.support,
  'hr-3': deptMascot.hr,
  'finance-1': deptMascot.finance,
  'finance-2': deptMascot.finance,
  'finance-3': deptMascot.hr,
  'legal-1': deptMascot.hr,
  'legal-2': deptMascot.finance,
  'ceo-1': deptMascot.management,   // 棕熊 → 猩猩
  'ceo-2': deptMascot.operation,    // 老虎
  'ceo-3': deptMascot.finance,      // 熊猫
  'support-1': deptMascot.legal,    // 羊驼 → 独角兽
  'support-2': deptMascot.finance,
  'support-3': deptMascot.support,
  'data-1': deptMascot.data,
  'data-2': deptMascot.management,
  'data-3': deptMascot.support,
};

export function getPartyAvatar(npcId: string, departmentId: string): string {
  return npcAvatarMap[npcId] ?? deptMascot[departmentId] ?? defaultAvatar;
}
