import { memo } from 'react';
import type { CareerTier, RealWorkScene, CommunityVoice } from '@/types';

const TIER_COLORS: Record<string, string> = {
  '实习生': '#9ca3af',
  '专员 +1': '#60a5fa',
  '高级 / 主管': '#f59e0b',
  '总监': '#a78bfa',
  '负责人 / VP': '#1a1a1a',
};

interface CareerLadderProps {
  tiers: CareerTier[];
  color: string;
  compact?: boolean;
  realScenes?: RealWorkScene[];
  voices?: CommunityVoice[];
}

function CareerLadderComponent({ tiers, color, compact = false, realScenes, voices }: CareerLadderProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <p className="text-[10px] font-extrabold tracking-wide" style={{ color }}>
        职级分层 · 大概长这样
      </p>
      {tiers.map((tier) => (
        <div
          key={tier.rank}
          className="relative pl-3 border-l-2"
          style={{ borderColor: TIER_COLORS[tier.rank] || color }}
        >
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span
              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: (TIER_COLORS[tier.rank] || color) + '22', color: TIER_COLORS[tier.rank] || color }}
            >
              {tier.rank}
            </span>
            <span className="text-[10px] font-bold" style={{ color: '#444' }}>{tier.roleTitle}</span>
          </div>
          {!compact && (
            <p className="text-[10px] leading-relaxed mb-0.5" style={{ color: '#666' }}>{tier.dailyWork}</p>
          )}
          <p className="text-[9px] italic leading-snug" style={{ color: '#999' }}>▸ {tier.realityCheck}</p>
        </div>
      ))}

      { realScenes && realScenes.length > 0 && (
        <div className="pt-2 mt-2 border-t-2" style={{ borderColor: color + '28' }}>
          <p className="text-[10px] font-extrabold mb-1" style={{ color }}>📋 真实一会儿</p>
          <div className="space-y-1.5">
            {realScenes.slice(0, compact ? 2 : 3).map((s) => (
              <div key={s.title}>
                <p className="text-[8px] font-bold" style={{ color }}>{s.title}</p>
                <p className="text-[8px] leading-snug" style={{ color: '#666' }}>{s.scene}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {voices && voices.length > 0 && (
        <div className="pt-1 space-y-1.5">
          <p className="text-[10px] font-extrabold" style={{ color }}>💬 过来人嘀咕</p>
          {(compact ? voices.slice(0, 1) : voices).map((v, i) => (
            <blockquote key={i} className="text-[9px] leading-relaxed pl-2 border-l-2 italic" style={{ borderColor: color + '66', color: '#666' }}>
              「{v.text}」
              <span className="block not-italic text-[8px] mt-0.5" style={{ color: '#aaa' }}>— {v.from}</span>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}

function TierBadgeComponent({ label, color }: { label: string; color: string }) {
  const tierColor = Object.entries(TIER_COLORS).find(([k]) => label.includes(k.split(' ')[0]) || label === k)?.[1] || color;
  return (
    <span
      className="text-[8px] font-extrabold px-1.5 py-0.5 rounded shrink-0"
      style={{ backgroundColor: tierColor + '22', color: tierColor }}
    >
      {label}
    </span>
  );
}

export default memo(CareerLadderComponent);
export const TierBadge = memo(TierBadgeComponent);
