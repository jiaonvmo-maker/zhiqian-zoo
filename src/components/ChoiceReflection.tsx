import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChoiceReflectionProps {
  thought: string;
  teach?: string | null;
  color: string;
  onComplete: () => void;
}

export default function ChoiceReflection({ thought, teach, color, onComplete }: ChoiceReflectionProps) {
  const [phase, setPhase] = useState<'invite' | 'thought' | 'teach' | 'flash'>('invite');
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTeach = Boolean(teach);

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const advance = () => {
    if (phase === 'thought' && hasTeach) {
      setPhase('flash');
      flashTimer.current = setTimeout(() => setPhase('teach'), 420);
      return;
    }
    onComplete();
  };

  const showInvite = phase === 'invite';
  const showThought = phase === 'thought';
  const showTeach = phase === 'teach';
  const showFlash = phase === 'flash';
  const showFullOverlay = !showInvite;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end overflow-hidden pointer-events-none"
      style={{ top: showInvite ? 'auto' : 0, borderRadius: 'inherit' }}
    >
      {showFullOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 pointer-events-auto"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(45,37,32,0.55) 35%, rgba(45,37,32,0.72) 100%)' }}
        />
      )}

      {showThought && (
        <motion.div
          aria-hidden
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.55, times: [0, 0.35, 1] }}
          className="absolute top-[38%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}55 0%, transparent 70%)` }}
        />
      )}

      <div className="relative z-10 px-4 pb-5 pt-2 pointer-events-auto" style={{ perspective: 900 }}>
        <AnimatePresence mode="wait">
          {showInvite && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="pa-panel px-3 py-3"
              style={{ borderColor: color + '66', boxShadow: `0 8px 24px ${color}22` }}
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
                  style={{ background: `linear-gradient(175deg, ${color}cc 0%, ${color} 100%)`, borderColor: color }}
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

          {showFlash && (
            <motion.p
              key="flash"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1.15, y: 0 }}
              exit={{ opacity: 0, scale: 1.3, y: -10 }}
              transition={{ duration: 0.28 }}
              className="text-center text-lg font-extrabold mb-3 tracking-widest"
              style={{ color: 'var(--pa-gold)', textShadow: '0 2px 8px rgba(212,168,83,0.45)' }}
            >
              诶等等——
            </motion.p>
          )}

          {showThought && (
            <motion.div
              key="thought"
              initial={{ opacity: 0, y: 90, rotate: -6, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, rotate: 4, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="relative pa-panel p-4 mb-3 overflow-hidden"
              style={{ borderColor: color, boxShadow: `0 12px 32px ${color}33, 0 4px 0 ${color}` }}
            >
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 500, damping: 14 }}
                className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md"
                style={{ background: color, color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
              >
                啊这
              </motion.span>
              <p className="text-[10px] font-extrabold mb-2 tracking-wide" style={{ color }}>
                🧠 脑子：紧急插播
              </p>
              <p className="text-[15px] leading-relaxed font-bold" style={{ color: 'var(--pa-dark)' }}>
                {thought}
              </p>
            </motion.div>
          )}

          {showTeach && (
            <motion.div
              key="teach"
              initial={{ opacity: 0, y: 60, rotateX: 75, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              className="relative pa-panel p-4 mb-3 overflow-hidden"
              style={{
                borderColor: 'var(--pa-gold)',
                background: 'linear-gradient(165deg, #fffef8 0%, #fff8e6 100%)',
                boxShadow: '0 12px 32px rgba(212,168,83,0.28), 0 4px 0 var(--pa-gold-dark)',
              }}
            >
              <motion.span
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12, type: 'spring', stiffness: 400, damping: 18 }}
                className="absolute -top-1 -left-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md"
                style={{ background: 'var(--pa-gold)', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
              >
                多嘴
              </motion.span>
              <p className="text-[10px] font-extrabold mb-2 tracking-wide" style={{ color: 'var(--pa-gold-dark)' }}>
                🗣️ 路过的老员工又说话了
              </p>
              <p className="text-[14px] leading-relaxed font-semibold" style={{ color: '#554' }}>
                {teach}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!showInvite && !showFlash && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showThought ? 0.35 : 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            {hasTeach && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ background: showThought ? color : 'var(--pa-gold)' }}
                />
                <span
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ background: showTeach ? 'var(--pa-gold)' : '#ccc' }}
                />
              </div>
            )}
            <div className="flex gap-2 w-full">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={advance}
                className="flex-1 py-3 text-sm pa-btn pa-btn-height"
                style={
                  showTeach
                    ? { background: 'linear-gradient(175deg, #f0dfa8 0%, var(--pa-gold) 100%)', borderColor: 'var(--pa-gold-dark)' }
                    : { background: `linear-gradient(175deg, ${color}cc 0%, ${color} 100%)`, borderColor: color }
                }
              >
                {showThought && hasTeach ? '还有？那再听一句' : '收功，下一幕 →'}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="px-4 py-3 text-sm pa-btn pa-btn-cream pa-btn-height shrink-0"
              >
                溜了
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
