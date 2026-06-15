import type { ReactNode } from 'react';
import { memo } from 'react';

interface PAHeaderProps {
  onBack?: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  dark?: boolean;
}

function PAHeaderComponent({ onBack, title, subtitle, icon, right, dark }: PAHeaderProps) {
  return (
    <header className={`pa-hud absolute top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between ${dark ? 'border-white/10' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button type="button" onClick={onBack} className="pa-icon-btn w-10 h-10 shrink-0 pa-touch-target" aria-label="返回">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pa-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {icon && <span className="shrink-0 text-xl sm:text-2xl leading-none">{icon}</span>}
        <div className="min-w-0">
          <p className="pa-title text-[15px] sm:text-base truncate">{title}</p>
          {subtitle && <p className="pa-subtitle text-[11px] truncate mt-0.5 opacity-80">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0 ml-3">{right}</div>}
    </header>
  );
}

export default memo(PAHeaderComponent);
