import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IdBadgeProps {
  children: ReactNode;
  className?: string;
  /** 卡片本体额外 class（边框色等） */
  cardClassName?: string;
}

/** 整张工牌：绳夹 + 卡从上方掉落晃停 */
export default function IdBadge({ children, className = '', cardClassName = '' }: IdBadgeProps) {
  return (
    <motion.div
      className={`pa-id-badge ${className}`}
      initial={{ y: -320, rotate: -9, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: [-9, 5.5, -2.5, 1.2, 0],
      }}
      exit={{ y: -80, opacity: 0, rotate: -4 }}
      transition={{
        y: { type: 'spring', stiffness: 260, damping: 18, mass: 0.9 },
        opacity: { duration: 0.22 },
        rotate: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <div className="pa-id-badge__rig" aria-hidden>
        <span className="pa-id-badge__strap" />
        <span className="pa-id-badge__clip" />
      </div>
      <div className={`pa-id-badge__card ${cardClassName}`}>
        <span className="pa-id-badge__slot" />
        {children}
      </div>
    </motion.div>
  );
}
