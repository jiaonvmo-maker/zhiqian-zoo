import type { ReactNode } from 'react';
import { memo } from 'react';

type Variant = 'lobby' | 'party' | 'warm' | 'sky';

interface PABackgroundProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const bgClass: Record<Variant, string> = {
  lobby: 'pa-bg-lobby',
  party: 'pa-bg-party',
  warm: 'pa-bg-warm',
  sky: 'pa-bg-sky',
};

/** 纯色渐变背景，无光斑/噪点/动画 */
function PABackgroundComponent({ variant = 'lobby', children, className = '' }: PABackgroundProps) {
  return (
    <div className={`relative w-full h-screen overflow-hidden ${bgClass[variant]} ${className}`}>
      {children}
    </div>
  );
}

export default memo(PABackgroundComponent);
