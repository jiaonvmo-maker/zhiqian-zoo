import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Heart, Coffee, X, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import FluffyAvatar from './FluffyAvatar';

export default function CyberBadge() {
  const { user, showBadge, toggleBadge } = useGameStore();
  const [flipped, setFlipped] = useState(false);

  if (!user || !showBadge) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(34, 34, 34, 0.45)' }}
      onClick={toggleBadge}
    >
      <motion.div
        initial={{ scale: 0.65, y: 40, rotate: -6 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.65, y: 40 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
        className="relative w-80"
        style={{ perspective: '1000px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55 }} style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="w-full p-6 pa-panel pa-panel-accent"
            style={{ backfaceVisibility: 'hidden', borderColor: 'var(--pa-gold)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
              <FluffyAvatar src={user.avatar} size={64} showExpression={false} />
                <div>
                  <p className="pa-title text-base">{user.name}</p>
                  <span className="pa-tag mt-1 inline-block">{user.title}</span>
                </div>
              </div>
              <button type="button" onClick={toggleBadge} className="pa-icon-btn w-9 h-9">
                <X size={16} style={{ color: 'var(--pa-orange)' }} />
              </button>
            </div>
            <div className="pa-progress-track h-2 mb-3">
              <div className="pa-progress-fill w-full" />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {user.tags.map((tag) => (
                <span key={tag} className="pa-tag-pink text-xs px-3 py-1">{tag}</span>
              ))}
            </div>
            <p className="pa-subtitle text-xs mb-4 leading-relaxed">{user.bio}</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 pa-tag px-3 py-1.5">
                <Heart size={14} fill="var(--pa-pink)" style={{ color: 'var(--pa-pink)' }} />
                <span className="text-sm font-bold">{user.likes}</span>
              </div>
              {user.isVip && <span className="pa-tag text-xs font-bold">👑 VIP</span>}
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
              <RotateCcw size={12} /> 翻转 · 匹配档案版 🎯
            </button>
          </div>

          <div
            className="absolute inset-0 w-full p-6 pa-panel"
            style={{
              background: 'linear-gradient(145deg, var(--pa-gold-light), var(--pa-orange), var(--pa-pink))',
              borderColor: 'var(--pa-gold-dark)',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="pa-title text-lg text-white">{user.name}</p>
              <button type="button" onClick={toggleBadge} className="pa-icon-btn w-9 h-9 bg-white/30 border-white/50">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="h-1 w-full mb-3 rounded-full bg-white/35" />
            <p className="text-xs mb-3 text-white/90 font-bold">🎯 职前动物园认证档案</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-white font-bold">迷茫指数: <span className="text-[var(--pa-cream)]">📉 正在下降中</span></p>
              <p className="text-sm text-white font-bold">探索进度: <span className="text-[var(--pa-cream)]">3/11 部门 🏢</span></p>
              <p className="text-sm text-white font-bold">匹配度: <span className="text-[var(--pa-cream)]">87% ✨</span></p>
              <p className="text-sm text-white font-bold">职业直觉: <span>💡 逐渐清晰</span></p>
            </div>
            <button type="button" onClick={() => setFlipped(false)} className="w-full flex items-center justify-center gap-1 text-xs font-bold text-white/85">
              <RotateCcw size={12} /> 翻转 · 工牌版 💼
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
