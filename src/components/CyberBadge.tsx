import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Heart, Coffee, X, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import FluffyAvatar from './FluffyAvatar';
import IdBadge from './IdBadge';

export default function CyberBadge() {
  const { user, showBadge, toggleBadge } = useGameStore();
  const [flipped, setFlipped] = useState(false);

  if (!user || !showBadge) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6 sm:pt-10"
      style={{ backgroundColor: 'rgba(34, 34, 34, 0.45)' }}
      onClick={toggleBadge}
    >
      <div
        className="relative w-full flex justify-center"
        style={{ perspective: '1000px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <IdBadge>
          <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55 }} style={{ transformStyle: 'preserve-3d' }}>
            <div style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex justify-between items-start mb-3">
                <p className="pa-id-badge__header mb-0 text-left">请勿拍打玻璃 · 一日通行证</p>
                <button type="button" onClick={toggleBadge} className="pa-icon-btn w-9 h-9 shrink-0 -mt-1">
                  <X size={16} style={{ color: 'var(--pa-orange)' }} />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <FluffyAvatar src={user.avatar} size={64} showExpression={false} />
                <div className="min-w-0">
                  <p className="pa-title text-base truncate">{user.name}</p>
                  <span className="pa-tag mt-1 inline-block max-w-full truncate">{user.title}</span>
                </div>
              </div>
              <div className="pa-progress-track h-2 mb-3">
                <div className="pa-progress-fill w-full" />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {user.tags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className={i % 2 === 0 ? 'pa-tag pa-tag-pink' : 'pa-tag'}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="pa-subtitle text-xs mb-4 leading-relaxed">{user.bio}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 pa-tag px-3 py-1.5">
                  <Heart size={14} fill="var(--pa-pink)" style={{ color: 'var(--pa-pink)' }} />
                  <span className="text-sm font-bold">{user.likes}</span>
                </div>
                {user.isVip && <span className="pa-tag text-xs font-bold">VIP</span>}
              </div>
              <div className="flex gap-2">
                <button type="button" className="flex-1 h-10 pa-btn pa-btn-cream text-xs gap-1">
                  <Coffee size={14} />递咖啡
                </button>
                <button type="button" className="flex-1 h-10 pa-btn pa-btn-pink text-xs gap-1">
                  <Heart size={14} />拍一拍
                </button>
              </div>
              <button type="button" onClick={() => setFlipped(true)} className="w-full mt-3 flex items-center justify-center gap-1 pa-subtitle text-xs font-bold">
                <RotateCcw size={12} /> 翻转 · 匹配档案版
              </button>
            </div>

            <div
              className="absolute inset-0 w-full p-0"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div
                className="h-full min-h-full rounded-[10px] p-1"
                style={{
                  background: 'linear-gradient(145deg, var(--pa-gold-light), var(--pa-orange), var(--pa-pink))',
                }}
              >
                <div className="flex justify-between items-start mb-4 px-1 pt-1">
                  <p className="pa-title text-lg text-white">{user.name}</p>
                  <button type="button" onClick={toggleBadge} className="pa-icon-btn w-9 h-9 bg-white/30 border-white/50">
                    <X size={16} className="text-white" />
                  </button>
                </div>
                <div className="h-1 w-full mb-3 rounded-full bg-white/35" />
                <p className="text-xs mb-3 text-white/90 font-bold px-1">幻觉认证档案 · 不可当简历</p>
                <div className="space-y-2 mb-4 px-1">
                  <p className="text-sm text-white font-bold">迷茫指数: <span className="text-[var(--pa-cream)]">正在下降中</span></p>
                  <p className="text-sm text-white font-bold">探索进度: <span className="text-[var(--pa-cream)]">3/11 部门</span></p>
                  <p className="text-sm text-white font-bold">匹配度: <span className="text-[var(--pa-cream)]">87%</span></p>
                  <p className="text-sm text-white font-bold">职业直觉: <span>逐渐清晰</span></p>
                </div>
                <button type="button" onClick={() => setFlipped(false)} className="w-full flex items-center justify-center gap-1 text-xs font-bold text-white/85">
                  <RotateCcw size={12} /> 翻转 · 工牌版
                </button>
              </div>
            </div>
          </motion.div>
        </IdBadge>
      </div>
    </motion.div>
  );
}
