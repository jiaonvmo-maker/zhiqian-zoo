/** 猛兽派对风格角色资产 — 全站统一用 pa-* 毛绒动物 */

/** 静态资源路径（兼容 GitHub Pages 子路径） */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${clean}`;
}

const avatar = (file: string) => `/images/avatars/${file}`;

export const deptMascot: Record<string, string> = {
  management: avatar('pa-gorilla.png'),
  legal: avatar('pa-unicorn.png'),
  finance: avatar('pa-panda.png'),
  design: avatar('pa-cat.png'),
  product: avatar('pa-corgi.png'),
  commercial: avatar('pa-dog.png'),
  tech: avatar('pa-dino.png'),
  data: avatar('pa-fox.png'),
  operation: avatar('pa-tiger.png'),
  hr: avatar('pa-croc.png'),
  support: avatar('pa-duck.png'),
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
  'pm-1': deptMascot.product,
  'pm-2': deptMascot.commercial,
  'pm-3': deptMascot.finance,
  'pm-4': deptMascot.support,
  'dev-1': deptMascot.data,
  'dev-2': deptMascot.finance,
  'qa-1': deptMascot.support,
  'dev-4': deptMascot.commercial,
  'dev-5': deptMascot.tech,
  'op-1': deptMascot.design,
  'op-2': deptMascot.data,
  'op-3': deptMascot.support,
  'op-4': deptMascot.management,
  'sales-1': deptMascot.operation,
  'sales-2': deptMascot.commercial,
  'sales-3': deptMascot.data,
  'design-1': deptMascot.design,
  'design-2': deptMascot.design,
  'design-3': deptMascot.management,
  'design-4': deptMascot.finance,
  'hr-1': deptMascot.legal,
  'hr-2': deptMascot.support,
  'hr-3': deptMascot.hr,
  'finance-1': deptMascot.finance,
  'finance-2': deptMascot.finance,
  'finance-3': deptMascot.hr,
  'legal-1': deptMascot.hr,
  'legal-2': deptMascot.finance,
  'ceo-1': deptMascot.management,
  'ceo-2': deptMascot.operation,
  'ceo-3': deptMascot.finance,
  'support-1': deptMascot.legal,
  'support-2': deptMascot.finance,
  'support-3': deptMascot.support,
  'data-1': deptMascot.data,
  'data-2': deptMascot.management,
  'data-3': deptMascot.support,
};

export function getPartyAvatar(npcId: string, departmentId: string): string {
  return npcAvatarMap[npcId] ?? deptMascot[departmentId] ?? defaultAvatar;
}
