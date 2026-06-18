import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CareerTier, RealWorkScene, CommunityVoice } from '@/types';

const TIER_COLORS: Record<string, string> = {
  '实习生': '#9ca3af',
  '专员 +1': '#60a5fa',
  '高级 / 主管': '#f59e0b',
  '总监': '#a78bfa',
  '负责人 / VP': '#1a1a1a',
};

const SENIOR_RANKS = new Set(['高级 / 主管', '总监', '负责人 / VP']);

function TierBlock({
  tier,
  color,
  compact,
}: {
  tier: CareerTier;
  color: string;
  compact: boolean;
}) {
  const tierColor = TIER_COLORS[tier.rank] || color;
  return (
    <div className="relative pl-3 border-l-2" style={{ borderColor: tierColor }}>
      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
        <span
          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: tierColor + '22', color: tierColor }}
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
  );
}

interface CareerLadderProps {
  tiers: CareerTier[];
  color: string;
  compact?: boolean;
  realScenes?: RealWorkScene[];
  voices?: CommunityVoice[];
}

function CareerLadderComponent({ tiers, color, compact = false, realScenes, voices }: CareerLadderProps) {
  const [seniorOpen, setSeniorOpen] = useState(false);
  const [scenesOpen, setScenesOpen] = useState(false);

  const juniorTiers = tiers.filter((t) => !SENIOR_RANKS.has(t.rank));
  const seniorTiers = tiers.filter((t) => SENIOR_RANKS.has(t.rank));

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <p className="text-[10px] font-extrabold tracking-wide" style={{ color }}>
        职级分层 · 大概长这样
      </p>

      <div className="space-y-2">
        {juniorTiers.map((tier) => (
          <TierBlock key={tier.rank} tier={tier} color={color} compact={compact} />
        ))}
      </div>

      {seniorTiers.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setSeniorOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg text-left transition-colors hover:bg-black/[0.03]"
          >
            <span className="text-[10px] font-extrabold" style={{ color: '#f59e0b' }}>
              高级及以上 · {seniorTiers.length} 档
            </span>
            <span className="text-[10px] font-bold shrink-0" style={{ color: '#aaa' }}>{seniorOpen ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence initial={false}>
            {seniorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1.5">
                  {seniorTiers.map((tier) => (
                    <TierBlock key={tier.rank} tier={tier} color={color} compact={compact} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {realScenes && realScenes.length > 0 && (
        <div className="pt-2 mt-1 border-t-2" style={{ borderColor: color + '28' }}>
          <button
            type="button"
            onClick={() => setScenesOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 py-1 text-left"
          >
            <p className="text-[10px] font-extrabold" style={{ color }}>📋 真实一会儿</p>
            <span className="text-[10px] font-bold shrink-0" style={{ color: '#aaa' }}>{scenesOpen ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence initial={false}>
            {scenesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 pt-1">
                  {realScenes.slice(0, compact ? 2 : 3).map((s) => (
                    <div key={s.title}>
                      <p className="text-[8px] font-bold" style={{ color }}>{s.title}</p>
                      <p className="text-[8px] leading-snug" style={{ color: '#666' }}>{s.scene}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {voices && voices.length > 0 && scenesOpen && (
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
