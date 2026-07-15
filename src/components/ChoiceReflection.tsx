import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChoiceReflectionProps {
  thought: string;
  teach?: string | null;
  color: string;
  onComplete: () => void;
}

/** 选项后：猛兽派对风小面板弹一句，点一下或稍等继续 */
export default function ChoiceReflection({ thought, color, onComplete }: ChoiceReflectionProps) {
  useEffect(() => {
    const t = window.setTimeout(onComplete, 2600);
    return () => window.clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.button
      type="button"
      aria-label="继续"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onComplete}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 border-none cursor-pointer"
      style={{ background: 'rgba(253, 250, 246, 0.72)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 18, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -0.5 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        className="pa-panel pa-panel-accent w-full max-w-[17.5rem] px-4 py-4 text-center"
        style={{
          borderColor: color,
          boxShadow: `0 4px 0 ${color}99, 0 10px 24px rgba(74, 63, 53, 0.14)`,
          background: 'linear-gradient(180deg, #fffefb 0%, var(--pa-cream) 100%)',
        }}
      >
        <p
          className="pa-title text-[14px] sm:text-[15px] leading-snug font-extrabold"
          style={{ color: 'var(--pa-dark)' }}
        >
          {thought}
        </p>
      </motion.div>
    </motion.button>
  );
}
