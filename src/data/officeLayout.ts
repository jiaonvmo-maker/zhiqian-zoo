/** 办公室平面图 1:1 布局 — 坐标系与 office-floor-plan.jpg 对齐 */

export const OFFICE = { w: 24, d: 16, wallH: 2.55, wallT: 0.14 } as const;

/** 图纸 left/top 百分比 → 3D 世界坐标（原点居中） */
export function planToWorld(left: number, top: number) {
  return {
    x: (left / 100) * OFFICE.w - OFFICE.w / 2,
    z: (top / 100) * OFFICE.d - OFFICE.d / 2,
  };
}

/** 原 2D 工位图上的百分比点位 */
const PLAN_DESKS = [
  { left: 22, top: 32 }, { left: 28, top: 32 }, { left: 34, top: 32 },
  { left: 20, top: 45 }, { left: 26, top: 45 }, { left: 32, top: 45 },
  { left: 18, top: 58 }, { left: 24, top: 58 }, { left: 30, top: 58 },
  { left: 16, top: 70 }, { left: 22, top: 70 }, { left: 28, top: 70 },
  { left: 55, top: 40 }, { left: 62, top: 40 }, { left: 69, top: 40 },
  { left: 58, top: 55 }, { left: 65, top: 55 }, { left: 72, top: 55 },
  { left: 55, top: 68 }, { left: 62, top: 68 },
];

export const DESK_SLOTS = PLAN_DESKS.map((p) => {
  const pos = planToWorld(p.left, p.top);
  return { ...pos, rot: pos.x < 0 ? Math.PI / 2 : -Math.PI / 2 };
});

/** 墙体线段 [x1,z1,x2,z2] — 按原图房间分隔 */
export const WALL_SEGMENTS: [number, number, number, number][] = [
  // 外轮廓
  [-12, -8, 12, -8], [12, -8, 12, 8], [12, 8, -12, 8], [-12, 8, -12, -8],
  // 前台 / 入口区
  [-12, 4.5, -5.5, 4.5], [-5.5, 4.5, -5.5, 8],
  // 经理室
  [-5.5, 0.5, -1.5, 0.5], [-1.5, 0.5, -1.5, 4.5], [-5.5, 4.5, -5.5, 0.5],
  // 会议室
  [-1.5, -2.5, 4, -2.5], [4, -2.5, 4, 0.5], [-1.5, 0.5, -1.5, -2.5],
  // 厨房隔断
  [2, -8, 2, -4.5], [2, -4.5, 9, -4.5],
  // 卫生间区
  [9, -4.5, 9, 0], [9, 0, 12, 0],
  // 右侧 annex 分隔
  [7.5, -2, 7.5, 6.5], [7.5, 6.5, 12, 6.5],
];

export type FurnitureKind =
  | 'reception'
  | 'execDesk'
  | 'meetingRow'
  | 'pod4'
  | 'pod2'
  | 'counter'
  | 'roundTable'
  | 'couch'
  | 'bookshelf'
  | 'plant'
  | 'vending';

export interface FurnitureItem {
  kind: FurnitureKind;
  left: number;
  top: number;
  rot?: number;
}

/** 固定家具 — 按原图大致位置 */
export const FURNITURE: FurnitureItem[] = [
  { kind: 'reception', left: 10, top: 82, rot: 0.3 },
  { kind: 'couch', left: 8, top: 88 },
  { kind: 'execDesk', left: 22, top: 62, rot: -0.2 },
  { kind: 'bookshelf', left: 14, top: 58 },
  { kind: 'meetingRow', left: 28, top: 38 },
  { kind: 'meetingRow', left: 28, top: 48 },
  { kind: 'pod4', left: 26, top: 28 },
  { kind: 'pod4', left: 34, top: 28 },
  { kind: 'pod4', left: 26, top: 42 },
  { kind: 'pod4', left: 34, top: 42 },
  { kind: 'pod4', left: 26, top: 56 },
  { kind: 'pod4', left: 34, top: 56 },
  { kind: 'pod2', left: 22, top: 70 },
  { kind: 'pod2', left: 30, top: 70 },
  { kind: 'counter', left: 52, top: 12 },
  { kind: 'roundTable', left: 58, top: 22 },
  { kind: 'roundTable', left: 64, top: 22 },
  { kind: 'vending', left: 78, top: 10 },
  { kind: 'vending', left: 84, top: 10 },
  { kind: 'pod4', left: 58, top: 42 },
  { kind: 'pod4', left: 66, top: 42 },
  { kind: 'pod4', left: 74, top: 42 },
  { kind: 'pod2', left: 58, top: 58 },
  { kind: 'pod2', left: 66, top: 58 },
  { kind: 'pod2', left: 58, top: 72 },
  { kind: 'plant', left: 6, top: 18 },
  { kind: 'plant', left: 48, top: 32 },
  { kind: 'plant', left: 72, top: 68 },
  { kind: 'plant', left: 90, top: 28 },
];
