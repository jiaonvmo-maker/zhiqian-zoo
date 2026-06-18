import { useRef, useState, useEffect, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, animate, useDragControls, type PanInfo } from 'framer-motion';

const PEEK = 44;
const SPRING = { type: 'spring' as const, stiffness: 400, damping: 34, mass: 0.85 };

type Side = 'left' | 'right';

interface DraggableSidePanelProps {
  side: Side;
  color: string;
  peekIcon: string;
  peekLabel: string;
  children: ReactNode;
  contentClassName?: string;
}

export default function DraggableSidePanel({
  side,
  color,
  peekIcon,
  peekLabel,
  children,
  contentClassName = '',
}: DraggableSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelW, setPanelW] = useState(side === 'left' ? 192 : 224);
  const [collapsed, setCollapsed] = useState(false);
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setPanelW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hideX = Math.max(0, panelW - PEEK);

  useEffect(() => {
    const target = collapsed ? (side === 'left' ? -hideX : hideX) : 0;
    animate(x, target, SPRING);
  }, [collapsed, hideX, side, x]);

  const snap = (_: unknown, info: PanInfo) => {
    const pos = x.get();
    if (side === 'left') {
      setCollapsed(pos < -hideX * 0.32 || info.velocity.x < -380);
    } else {
      setCollapsed(pos > hideX * 0.32 || info.velocity.x > 380);
    }
  };

  const constraints =
    side === 'left' ? { left: -hideX, right: 0 } : { left: 0, right: hideX };

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragControls.start(e);
  };

  return (
    <motion.div
      style={{ x, touchAction: 'none' }}
      drag="x"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={constraints}
      dragElastic={0.06}
      dragMomentum={false}
      onDragEnd={snap}
      className={`absolute top-20 z-30 ${side === 'left' ? 'left-3 sm:left-4' : 'right-3 sm:right-16'}`}
    >
      <div ref={panelRef} className={`relative ${contentClassName}`}>
        {/* 拖拽把手 — 贴边可手推 */}
        <div
          role="slider"
          aria-label={side === 'left' ? '左滑收起带路人' : '右滑收起详情'}
          aria-valuenow={collapsed ? 0 : 100}
          onPointerDown={startDrag}
          className={`absolute top-0 bottom-0 w-6 z-20 flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${
            side === 'left' ? '-right-1' : '-left-1'
          }`}
        >
          <div
            className="w-1 h-10 rounded-full opacity-35"
            style={{ background: color }}
          />
        </div>

        {/* 收起后露出的标签，也可拖出 */}
        <div
          onPointerDown={startDrag}
          className={`absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing ${
            side === 'left' ? 'left-0 w-[44px]' : 'right-0 w-[44px]'
          } ${collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div
            className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg"
            style={{ background: color + '18' }}
          >
            <span className="text-sm leading-none">{peekIcon}</span>
            <span
              className="text-[8px] font-extrabold leading-tight text-center"
              style={{ color, writingMode: 'vertical-rl' }}
            >
              {peekLabel}
            </span>
          </div>
        </div>

        <div className={collapsed ? 'pointer-events-none' : ''}>{children}</div>
      </div>
    </motion.div>
  );
}
