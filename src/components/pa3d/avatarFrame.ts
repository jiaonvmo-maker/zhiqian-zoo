export type AvatarVariant = 'avatar' | 'legs';

/** 圆框肖像取景 — avatar=脸+上半身居中；legs=入口页下半身 */
export const AVATAR_FRAME: Record<
  AvatarVariant,
  { groupY: number; scale: number; zoomMul: number; cameraY: number; rotationY: number }
> = {
  avatar: {
    groupY: -0.44,
    scale: 0.88,
    zoomMul: 1.05,
    cameraY: 0.06,
    rotationY: 0.28,
  },
  legs: {
    groupY: -0.2,
    scale: 1,
    zoomMul: 2.15,
    cameraY: 0,
    rotationY: 0.35,
  },
};

export function portraitRingStyle(size: number, borderColor: string) {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    border: `3px solid ${borderColor}`,
    boxShadow: `0 2px 0 ${borderColor}66, 0 4px 10px rgba(0,0,0,0.08)`,
    background: 'linear-gradient(180deg, #e8f6fc 0%, #fff9f2 100%)',
  } as const;
}
