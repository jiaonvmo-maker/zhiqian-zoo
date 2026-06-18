import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { departments } from '@/data/departments';
import { npcs } from '@/data/npcs';
import { assetUrl, getPartyAvatar } from '@/data/partyAnimalsAssets';
import PrivateChat from './PrivateChat';
import CyberBadge from './CyberBadge';
import PAHeader from '@/components/pa/PAHeader';
import CareerLadder, { TierBadge } from '@/components/CareerLadder';
import WorkMomentModal from '@/components/WorkMomentModal';
import { getWorkMoment } from '@/data/workMoments';
import Workstation3D from '@/components/Workstation3D';
import DraggableSidePanel from '@/components/DraggableSidePanel';

const TIER_ORDER = { intern: 0, associate: 1, senior: 2, director: 3, executive: 4 } as const;
const SCENE_BG = '#e8e4df';

function NpcThumb({ npcId, deptId, size, borderColor }: { npcId: string; deptId: string; size: number; borderColor: string }) {
  const src = getPartyAvatar(npcId, deptId);
  return (
    <div
      className="shrink-0 rounded-full overflow-hidden"
      style={{ width: size, height: size, border: `2px solid ${borderColor}`, background: '#fff9f2' }}
    >
      <img src={assetUrl(src)} alt="" className="w-full h-full object-cover object-[center_20%]" draggable={false} />
    </div>
  );
}

export default function WorkstationScene() {
  const { selectedDept, selectDepartment, setPhase, showBadge } = useGameStore();
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [hoveredNPC, setHoveredNPC] = useState<string | null>(null);
  const [tryWork, setTryWork] = useState(false);

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

  const hoveredNpcData = npcs.find((n) => n.id === hoveredNPC);

  return (
    <div className="relative w-full h-screen overflow-hidden pa-bg-lobby">
      <div className="absolute inset-0 pt-16" style={{ height: 'calc(100vh - 4rem)', background: SCENE_BG }}>
        <Workstation3D
          npcs={deptNpcs}
          deptColor={dept.color}
          hoveredNPC={hoveredNPC}
          onHover={setHoveredNPC}
          onSelect={setSelectedNPC}
        />
      </div>

      <PAHeader
        onBack={() => setPhase('sandbox')}
        icon={<NpcThumb npcId={deptNpcs[0]?.id ?? ''} deptId={dept.id} size={36} borderColor={dept.color} />}
        title={`${dept.name}工位`}
        subtitle="侧栏可手推收起 · 拖拽旋转 · 点击深聊"
        right={
          <button type="button" onClick={() => selectDepartment(dept.id)} className="pa-btn pa-btn-pink text-xs px-4 py-1.5 h-auto min-h-0">
            💬 群聊
          </button>
        }
      />

      <DraggableSidePanel
        side="left"
        color={dept.color}
        peekIcon="🐾"
        peekLabel="带路人"
        contentClassName="w-44 sm:w-48 max-h-[60vh]"
      >
        <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          <p className="text-[10px] font-extrabold mb-0.5 px-1 sticky top-0 bg-[#fdfaf6]/90 py-1" style={{ color: dept.color }}>
            🐾 职级带路人
          </p>
          {deptNpcs.map((npc) => (
            <button
              key={npc.id}
              type="button"
              onClick={() => setSelectedNPC(npc.id)}
              className={`flex items-center gap-2 text-left transition-colors ${hoveredNPC === npc.id ? 'pa-panel-accent' : 'pa-panel'}`}
              style={{
                borderColor: hoveredNPC === npc.id ? dept.color : 'var(--pa-brown-light)',
                padding: '6px 10px',
              }}
              onMouseEnter={() => setHoveredNPC(npc.id)}
              onMouseLeave={() => setHoveredNPC(null)}
            >
              <NpcThumb npcId={npc.id} deptId={dept.id} size={32} borderColor={dept.color} />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold truncate" style={{ color: '#333' }}>{npc.name}</p>
                <p className="text-[9px] font-bold truncate" style={{ color: '#888' }}>{npc.role}</p>
                <TierBadge label={npc.tierLabel} color={dept.color} />
              </div>
            </button>
          ))}
        </div>
      </DraggableSidePanel>

      <DraggableSidePanel
        side="right"
        color={dept.color}
        peekIcon="📋"
        peekLabel={dept.shortName}
        contentClassName="w-48 sm:w-56 max-h-[65vh]"
      >
        <div
          className="max-h-[65vh] overflow-y-auto p-3 pa-panel scrollbar-hide"
          style={{ borderColor: dept.color, boxShadow: `0 6px 0 ${dept.color}66` }}
        >
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
      </DraggableSidePanel>

      <AnimatePresence>
        {hoveredNpcData && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl pa-panel pa-panel-accent"
            style={{ borderColor: dept.color, boxShadow: `0 6px 0 ${dept.color}88` }}
          >
            <div className="flex items-center gap-3">
              <NpcThumb npcId={hoveredNpcData.id} deptId={dept.id} size={56} borderColor={dept.color} />
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
          🎭 干一天 · 零基础体验
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
