import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChoiceReflectionProps {
  thought: string;
  teach?: string | null;
  color: string;
  onComplete: () => void;
}

export default function ChoiceReflection({ thought, teach, color, onComplete }: ChoiceReflectionProps) {
  const [phase, setPhase] = useState<'invite' | 'thought' | 'teach'>('invite');
  const hasTeach = Boolean(teach);

  const advance = () => {
    if (phase === 'thought' && hasTeach) {
      setPhase('teach');
      return;
    }
    onComplete();
  };

  return (
    <div className="shrink-0 border-t-2 px-3 py-3 relative z-40" style={{ borderColor: color + '44', background: 'var(--pa-cream)' }}>
      <AnimatePresence mode="wait">
        {phase === 'invite' && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <p className="text-[11px] font-bold leading-snug mb-2.5" style={{ color: '#555' }}>
              刚才那句发出去啦……
              <span style={{ color }}> 有人好像有话要说</span>
              {hasTeach ? '（可能还不止一句）' : ''}
            </p>
            <div className="flex gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('thought')}
                className="flex-1 py-2.5 text-[12px] pa-btn pa-btn-height min-h-0"
                style={{ background: `linear-gradient(175deg, ${color}cc 0%, ${color} 100%)`, borderColor: color, color: '#fff' }}
              >
                看看怎么个事 👀
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="flex-1 py-2.5 text-[12px] pa-btn pa-btn-cream pa-btn-height min-h-0"
              >
                不了，下一幕
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'thought' && (
          <motion.div
            key="thought"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <div className="pa-panel p-3 mb-2.5" style={{ borderColor: color + '88' }}>
              <p className="text-[13px] leading-relaxed font-semibold" style={{ color: 'var(--pa-dark)' }}>
                {thought}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={advance}
                className="flex-1 py-2.5 text-[12px] pa-btn pa-btn-height min-h-0"
                style={{ background: `linear-gradient(175deg, ${color}cc 0%, ${color} 100%)`, borderColor: color, color: '#fff' }}
              >
                {hasTeach ? '还有？那再听一句' : '收功，下一幕 →'}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="px-4 py-2.5 text-[12px] pa-btn pa-btn-cream pa-btn-height min-h-0 shrink-0"
              >
                溜了
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'teach' && (
          <motion.div
            key="teach"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <div
              className="pa-panel p-3 mb-2.5"
              style={{ borderColor: 'var(--pa-gold)', background: 'linear-gradient(165deg, #fffef8 0%, #fff8e6 100%)' }}
            >
              <p className="text-[13px] leading-relaxed font-semibold" style={{ color: '#554' }}>
                {teach}
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full py-2.5 text-[12px] pa-btn pa-btn-height min-h-0"
              style={{ background: 'linear-gradient(175deg, #f0dfa8 0%, var(--pa-gold) 100%)', borderColor: 'var(--pa-gold-dark)' }}
            >
              收功，下一幕 →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
