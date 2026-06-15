import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { departments } from '@/data/departments';
import { npcs } from '@/data/npcs';
import PrivateChat from './PrivateChat';
import CyberBadge from './CyberBadge';
import FluffyAvatar from './FluffyAvatar';
import PAHeader from '@/components/pa/PAHeader';
import CareerLadder, { TierBadge } from '@/components/CareerLadder';
import WorkMomentModal from '@/components/WorkMomentModal';
import { getWorkMoment } from '@/data/workMoments';

const TIER_ORDER = { intern: 0, associate: 1, senior: 2, director: 3, executive: 4 } as const;
const deskPositions = [
  { top: 32, left: 22 }, { top: 32, left: 28 }, { top: 32, left: 34 },
  { top: 45, left: 20 }, { top: 45, left: 26 }, { top: 45, left: 32 },
  { top: 58, left: 18 }, { top: 58, left: 24 }, { top: 58, left: 30 },
  { top: 70, left: 16 }, { top: 70, left: 22 }, { top: 70, left: 28 },
  { top: 40, left: 55 }, { top: 40, left: 62 }, { top: 40, left: 69 },
  { top: 55, left: 58 }, { top: 55, left: 65 }, { top: 55, left: 72 },
  { top: 68, left: 55 }, { top: 68, left: 62 },
];

export default function WorkstationScene() {
  const { selectedDept, selectDepartment, setPhase, showBadge } = useGameStore();
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [hoveredNPC, setHoveredNPC] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [tryWork, setTryWork] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const dept = departments.find((d) => d.id === selectedDept);
  if (!dept) {
    return (
      <div className="w-full h-screen flex items-center justify-center pa-bg-lobby">
        <div className="pa-panel p-8 text-center">
          <p className="pa-title text-xl mb-2">无法进入工位</p>
          <p className="pa-subtitle text-sm">部门ID未找到: {selectedDept}</p>
          <button onClick={() => setPhase('sandbox')} className="pa-btn pa-btn-pink mt-4 px-6 py-3">
            ← 返回大厦
          </button>
        </div>
      </div>
    );
  }

  const deptNpcs = npcs
    .filter((n) => n.departmentId === dept.id)
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
  // Map NPCs to desk positions (cycle through if more NPCs than desks)
  const npcsWithPos = deptNpcs.map((npc, i) => ({
    ...npc,
    pos: deskPositions[i % deskPositions.length],
    offsetY: Math.sin(i * 1.5) * 3, // slight bob offset for animation
  }));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(0.5, Math.min(2.5, s + e.deltaY * -0.001)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  // Touch pinch zoom
  const touchDist = useRef(0);
  const touchScale = useRef(1);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchDist.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchScale.current = scale;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setScale(Math.max(0.5, Math.min(2.5, touchScale.current * (d / touchDist.current))));
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchmove', onTouchMove); };
  }, [scale]);

  const hoveredNpcData = npcs.find((n) => n.id === hoveredNPC);

  return (
    <div className="relative w-full h-screen overflow-hidden pa-bg-lobby">
      {/* Office floor plan - draggable & zoomable */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onWheel={handleWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <div className="relative" style={{ width: 'min(95vw, 1400px)', height: 'min(90vh, 800px)' }}>
            <img
              src="/images/office-floor-plan.jpg"
              alt="Office Floor Plan"
              className="w-full h-full object-contain rounded-lg"
              style={{ filter: hoveredNPC ? 'brightness(0.85)' : 'brightness(0.95)' }}
              draggable={false}
            />

            {/* Party Animals NPCs on their desks */}
            {npcsWithPos.map((npc, i) => {
              const isHovered = hoveredNPC === npc.id;
              return (
                <motion.button
                  key={npc.id}
                  className="absolute"
                  style={{
                    top: `${npc.pos.top + npc.offsetY * 0.3}%`,
                    left: `${npc.pos.left}%`,
                    width: '7%',
                    height: '10%',
                    zIndex: isHovered ? 30 : 20 - i,
                  }}
                  onMouseEnter={() => setHoveredNPC(npc.id)}
                  onMouseLeave={() => setHoveredNPC(null)}
                  onClick={() => setSelectedNPC(npc.id)}
                  animate={{
                    y: [0, -4, 0],
                    transition: { duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={{ scale: 1.2, y: -8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Shadow */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      bottom: '-5%', left: '15%', width: '70%', height: '20%',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      filter: 'blur(3px)',
                      transform: isHovered ? 'scale(0.8)' : 'scale(1)',
                      transition: 'transform 0.2s',
                    }}
                  />

                  {/* Character image */}
                  <img
                    src={npc.avatar}
                    alt={npc.name}
                    className="w-full h-full object-contain"
                    style={{
                      filter: isHovered
                        ? `drop-shadow(0 6px 12px ${dept.color}80)`
                        : `drop-shadow(0 3px 6px rgba(0,0,0,0.25))`,
                      transition: 'filter 0.2s',
                    }}
                    draggable={false}
                  />

                  {/* Name tag on hover */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg whitespace-nowrap"
                      style={{
                        backgroundColor: dept.color,
                        boxShadow: `0 4px 16px ${dept.color}60`,
                      }}
                    >
                      <p className="text-white font-extrabold text-[10px]">{npc.name}</p>
                    </motion.div>
                  )}

                  {/* Glow ring on hover */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `3px solid ${dept.color}`,
                        boxShadow: `0 0 20px ${dept.color}50, inset 0 0 10px ${dept.color}20`,
                        animation: 'pulse 1s infinite',
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <PAHeader
        onBack={() => setPhase('sandbox')}
        icon={<FluffyAvatar src={deptNpcs[0]?.avatar || ''} size={36} mood="normal" borderColor={dept.color} showExpression={false} />}
        title={`${dept.name}工位`}
        subtitle={`${deptNpcs.length} 位各职级前辈 · 私聊了解真实日常`}
        right={
          <>
            <button type="button" onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} className="pa-btn pa-btn-cream text-xs px-3 py-1.5 h-auto min-h-0">⟲</button>
            <button type="button" onClick={() => selectDepartment(dept.id)} className="pa-btn pa-btn-pink text-xs px-4 py-1.5 h-auto min-h-0">💬 群聊</button>
          </>
        }
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setScale((s) => Math.min(2.5, s + 0.2))} className="pa-icon-btn w-11 h-11 text-lg font-bold pa-title">+</motion.button>
        <div className="pa-tag w-11 text-center text-[10px] py-1">{Math.round(scale * 100)}%</div>
        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} className="pa-icon-btn w-11 h-11 text-lg font-bold pa-title">−</motion.button>
      </div>

      {/* Left side - NPC list */}
      <div className="absolute left-4 top-20 z-30 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
        <p className="text-[10px] font-extrabold mb-1 px-1" style={{ color: dept.color }}>🐾 职级带路人</p>
        {deptNpcs.map((npc, i) => (
          <motion.button
            key={npc.id}
            onClick={() => setSelectedNPC(npc.id)}
            className={`flex items-center gap-2 text-left transition-all ${hoveredNPC === npc.id ? 'pa-panel-accent' : 'pa-panel'}`}
            style={{
              borderColor: hoveredNPC === npc.id ? dept.color : 'var(--pa-brown-light)',
              padding: '6px 10px',
            }}
            onMouseEnter={() => setHoveredNPC(npc.id)}
            onMouseLeave={() => setHoveredNPC(null)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <FluffyAvatar src={npc.avatar} size={32} mood={npc.personality} borderColor={dept.color} showExpression={false} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-extrabold truncate" style={{ color: '#333' }}>{npc.name}</p>
              </div>
              <p className="text-[9px] font-bold truncate" style={{ color: '#888' }}>{npc.role}</p>
              <TierBadge label={npc.tierLabel} color={dept.color} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right info panel */}
      <div className="absolute top-20 right-4 sm:right-16 z-30 w-48 sm:w-56 max-h-[65vh] overflow-y-auto p-3 pa-panel scrollbar-hide" style={{ borderColor: dept.color, boxShadow: `0 6px 0 ${dept.color}66` }}>
        <p className="text-sm font-extrabold mb-0.5" style={{ color: dept.color }}>{dept.name}</p>
        <p className="text-[10px] font-bold mb-1" style={{ color: dept.color }}>{dept.tagline}</p>
        <p className="text-[9px] leading-relaxed mb-2" style={{ color: '#888' }}>{dept.mission}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {dept.coreOutputs.map((f) => (
            <span key={f} className="px-1.5 py-0.5 text-[8px] font-bold rounded-full" style={{ backgroundColor: dept.color + '15', color: dept.color }}>{f}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#eee' }}>
            <div className="h-full rounded-full" style={{ width: `${dept.chaosLevel}%`, backgroundColor: dept.chaosLevel > 60 ? '#ff6b6b' : dept.chaosLevel > 40 ? '#ffe66d' : '#a8e6cf' }} />
          </div>
          <span className="text-[8px] font-bold whitespace-nowrap" style={{ color: '#888' }}>强度 {dept.chaosLevel}%</span>
        </div>
        <CareerLadder tiers={dept.careerLadder} color={dept.color} compact realScenes={dept.realScenes} voices={dept.voices} />
      </div>

      {/* NPC hover tooltip */}
      <AnimatePresence>
        {hoveredNpcData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl pa-panel pa-panel-accent"
            style={{ borderColor: dept.color, boxShadow: `0 6px 0 ${dept.color}88` }}
          >
            <div className="flex items-center gap-3">
              <FluffyAvatar src={hoveredNpcData.avatar} size={56} mood={hoveredNpcData.personality} showExpression borderColor={dept.color} />
              <div>
                <p className="text-sm font-extrabold" style={{ color: dept.color }}>{hoveredNpcData.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-[10px] font-bold" style={{ color: '#888' }}>{hoveredNpcData.role}</p>
                  <TierBadge label={hoveredNpcData.tierLabel} color={dept.color} />
                </div>
                <p className="text-[10px] mt-1 leading-snug" style={{ color: '#666' }}>{hoveredNpcData.dailyBrief}</p>
                <p className="text-[10px] font-bold mt-1" style={{ color: dept.color }}>👆 点击深聊这一职级</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30 flex-wrap px-4">
        <motion.button type="button" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => setPhase('sandbox')} className="px-6 py-3 text-sm pa-btn pa-btn-cream pa-btn-height">
          ← 回大厦
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setTryWork(true)}
          className="px-6 py-3 text-sm pa-btn pa-btn-height"
          style={{ borderColor: dept.color, boxShadow: `0 4px 0 ${dept.color}`, background: `linear-gradient(180deg, ${dept.color}dd, ${dept.color})`, color: '#fff' }}
        >
          📱 干一天 · 零基础体验
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => selectDepartment(dept.id)}
          className="px-8 py-3 text-sm pa-btn pa-btn-pink pa-btn-height"
        >
          💬 {dept.name}群聊
        </motion.button>
      </div>

      <AnimatePresence>{selectedNPC && <PrivateChat npcId={selectedNPC} onClose={() => setSelectedNPC(null)} />}</AnimatePresence>
      <AnimatePresence>{showBadge && <CyberBadge />}</AnimatePresence>
      <AnimatePresence>
        {tryWork && getWorkMoment(dept.id) && (
          <WorkMomentModal moment={getWorkMoment(dept.id)!} color={dept.color} onClose={() => setTryWork(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
