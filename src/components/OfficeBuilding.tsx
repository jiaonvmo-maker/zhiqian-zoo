import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { departments } from '@/data/departments';
import { npcs } from '@/data/npcs';
import PAHeader from '@/components/pa/PAHeader';
import CareerLadder from '@/components/CareerLadder';
import WorkMomentModal from '@/components/WorkMomentModal';
import { getWorkMoment } from '@/data/workMoments';
import FluffyAvatar from '@/components/FluffyAvatar';
import PlushAnimal from '@/components/pa3d/PlushAnimal';
import { breedFromAvatar } from '@/components/pa3d/breeds';

import { deptMascot } from '@/data/partyAnimalsAssets';

const floors = [
  { id: 'management', name: '管理层', color: '#c9a227', icon: '👑', npcImg: deptMascot.management, width: 4.9, depth: 3.4, x: 0, z: 0 },
  { id: 'legal', name: '法务部', color: '#8e8e93', icon: '⚖️', npcImg: deptMascot.legal, width: 4.3, depth: 3.1, x: -0.12, z: 0.05 },
  { id: 'finance', name: '财务部', color: '#00c7be', icon: '💵', npcImg: deptMascot.finance, width: 4.6, depth: 3.25, x: 0.08, z: -0.04 },
  { id: 'design', name: '设计部', color: '#ff2d55', icon: '🎨', npcImg: deptMascot.design, width: 4.35, depth: 3.05, x: -0.18, z: 0.1 },
  { id: 'product', name: '产品部', color: '#34c759', icon: '💡', npcImg: deptMascot.product, width: 4.75, depth: 3.35, x: 0.15, z: -0.06 },
  { id: 'commercial', name: '商业化', color: '#af52de', icon: '💰', npcImg: deptMascot.commercial, width: 4.4, depth: 3.15, x: -0.05, z: 0.08 },
  { id: 'tech', name: '技术部', color: '#007aff', icon: '💻', npcImg: deptMascot.tech, width: 4.95, depth: 3.5, x: 0.12, z: -0.1 },
  { id: 'data', name: '数据部', color: '#ff6b35', icon: '📊', npcImg: deptMascot.data, width: 4.5, depth: 3.2, x: -0.1, z: 0.04 },
  { id: 'operation', name: '运营部', color: '#ff9500', icon: '📢', npcImg: deptMascot.operation, width: 4.7, depth: 3.3, x: 0.04, z: -0.06 },
  { id: 'hr', name: '人事部', color: '#5856d6', icon: '👥', npcImg: deptMascot.hr, width: 4.25, depth: 3.05, x: -0.14, z: 0.08 },
  { id: 'support', name: '支持部', color: '#64d2ff', icon: '🎧', npcImg: deptMascot.support, width: 5.15, depth: 3.65, x: 0, z: 0 },
].reverse();

type Floor = (typeof floors)[number];

function FloorMascot({ npcImg, floorId }: { npcImg: string; floorId: string }) {
  const breed = useMemo(() => breedFromAvatar(npcImg), [npcImg]);
  const phase = useMemo(() => floorId.charCodeAt(0) * 0.1, [floorId]);
  return (
    <group position={[0, 0, 0]}>
      <group position={[0, -0.1, 0]} rotation={[0, -0.5, 0]} scale={0.52}>
        <PlushAnimal breed={breed} mood="idle" phase={phase} />
      </group>
    </group>
  );
}

function FloorMascotMarker({ position, npcImg, floorId }: { position: [number, number, number]; npcImg: string; floorId: string }) {
  return (
    <group position={position}>
      <FloorMascot npcImg={npcImg} floorId={floorId} />
    </group>
  );
}

function FloorBlock({ floor, index, hovered, selected, onHover, onSelect }: {
  floor: Floor;
  index: number;
  hovered: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const y = index * 0.47 + 0.35;
  const materialColor = hovered || selected ? floor.color : new THREE.Color(floor.color).lerp(new THREE.Color('#ffffff'), 0.18).getStyle();

  return (
    <group position={[floor.x, y, floor.z]}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); onHover(floor.id); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onSelect(floor.id); }}
        scale={hovered ? [1.035, 1.08, 1.035] : [1, 1, 1]}
      >
        <boxGeometry args={[floor.width, 0.34, floor.depth]} />
        <meshStandardMaterial color={materialColor} roughness={0.54} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.2, floor.depth / 2 + 0.02]}>
        <boxGeometry args={[floor.width * 0.92, 0.08, 0.08]} />
        <meshStandardMaterial color="#fff8ef" roughness={0.42} />
      </mesh>

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-floor.width / 2 + 0.65 + i * 0.85, 0.04, floor.depth / 2 + 0.055]}>
          <boxGeometry args={[0.34, 0.18, 0.035]} />
          <meshStandardMaterial color={hovered ? '#fff1a8' : '#ffe4b2'} emissive={hovered ? '#5c3200' : '#1f1200'} emissiveIntensity={hovered ? 0.18 : 0.04} roughness={0.35} />
        </mesh>
      ))}

      <Text
        position={[-floor.width / 2 + 0.34, 0.31, floor.depth / 2 + 0.08]}
        rotation={[-0.08, 0, 0]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#3b2b20"
      >
        {floor.name}
      </Text>

      <FloorMascotMarker position={[floor.width / 2 - 0.52, 0.25, floor.depth / 2 - 0.38]} npcImg={floor.npcImg} floorId={floor.id} />
    </group>
  );
}

function Building3D({ hoveredFloor, selectedFloor, onHover, onSelect }: {
  hoveredFloor: string | null;
  selectedFloor: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const floorMeshes = useMemo(() => floors, []);

  return (
    <Canvas
      shadows
      camera={{ position: [5.8, 4.7, 7.4], fov: 39 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#f7ebdd"]} />
      <fog attach="fog" args={["#f7ebdd", 10, 22]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-4, 4, -5]} intensity={0.8} />

      <group position={[0, -2.85, 0]} rotation={[0, -0.42, 0]}>
        <mesh receiveShadow position={[0, -0.12, 0]}>
          <cylinderGeometry args={[4.8, 5.2, 0.28, 8]} />
          <meshStandardMaterial color="#8d7966" roughness={0.9} />
        </mesh>
        <mesh receiveShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[4.55, 4.75, 0.22, 8]} />
          <meshStandardMaterial color="#f3e5d8" roughness={0.85} />
        </mesh>

        {floorMeshes.map((floor, index) => (
          <FloorBlock
            key={floor.id}
            floor={floor}
            index={index}
            hovered={hoveredFloor === floor.id}
            selected={selectedFloor === floor.id}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}

        <mesh castShadow receiveShadow position={[0, floors.length * 0.47 + 0.46, 0]}>
          <coneGeometry args={[3.15, 0.8, 8]} />
          <meshStandardMaterial color="#cfb07d" roughness={0.74} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, floors.length * 0.47 + 0.96, 0]}>
          <boxGeometry args={[1.65, 0.42, 1.15]} />
          <meshStandardMaterial color="#fff4df" roughness={0.55} />
        </mesh>
      </group>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.05, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#e8d8c8" roughness={1} />
      </mesh>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={5.2}
        maxDistance={11}
        autoRotate
        autoRotateSpeed={0.75}
        minPolarAngle={Math.PI / 4.2}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

export default function OfficeBuilding() {
  const { enterWorkstation, setPhase } = useGameStore();
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [tryWorkDept, setTryWorkDept] = useState<string | null>(null);

  const hoveredData = floors.find((f) => f.id === hoveredFloor);
  const deptData = selectedFloor ? departments.find((d) => d.id === selectedFloor) : null;
  const floorNpcs = selectedFloor ? npcs.filter((n) => n.departmentId === selectedFloor).slice(0, 4) : [];

  return (
    <div className="relative w-full h-screen overflow-hidden pa-bg-lobby">
      <div className="absolute inset-0 pt-16" style={{ width: '100%', height: 'calc(100vh - 4rem)' }}>
        <Building3D
          hoveredFloor={hoveredFloor}
          selectedFloor={selectedFloor}
          onHover={setHoveredFloor}
          onSelect={setSelectedFloor}
        />
      </div>

      <PAHeader
        onBack={() => setPhase('entry')}
        icon="🏢"
        title="职业探索大厦"
        subtitle="11 条业务线 · 5 层职级全景 · 点击楼层查阅"
        right={<span className="pa-tag-pink text-xs px-3 py-1">{departments.length} 部门</span>}
      />

      <div className="absolute left-4 sm:left-6 top-[5.5rem] z-30 w-56 pa-glass-card p-4 hidden sm:block">
        <p className="pa-label mb-1">导览</p>
        <p className="pa-title text-sm">职级分层</p>
        <p className="pa-subtitle text-[10px] mt-1.5 leading-relaxed">点楼层查看 实习生 → 负责人 的日常分工与真实现场。</p>
      </div>

      <AnimatePresence>
        {hoveredData && !selectedFloor && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-4 sm:left-6 top-52 z-40 w-56 p-4 pa-panel"
            style={{ borderColor: hoveredData.color + '44', boxShadow: `var(--pa-shadow-md), 0 0 0 1px ${hoveredData.color}22` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FluffyAvatar src={hoveredData.npcImg} size={52} mood="happy" borderColor={hoveredData.color} showExpression />
              <div>
                <p className="text-sm font-extrabold" style={{ color: hoveredData.color }}>{hoveredData.name}</p>
                <p className="text-[10px] font-bold" style={{ color: '#888' }}>{npcs.filter((n) => n.departmentId === hoveredData.id).length} 位职场带路人</p>
              </div>
            </div>
            <p className="text-[10px] font-bold mt-2" style={{ color: hoveredData.color }}>{departments.find((d) => d.id === hoveredData.id)?.tagline}</p>
            {departments.find((d) => d.id === hoveredData.id)?.voices[0] && (
              <p className="text-[9px] italic mt-1 leading-snug" style={{ color: '#888' }}>
                「{departments.find((d) => d.id === hoveredData.id)!.voices[0].text.slice(0, 42)}…」
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFloor && deptData && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-6 left-4 right-4 z-50 flex justify-center px-2 sm:px-4"
          >
            <div className="w-full max-w-xl max-h-[72vh] overflow-y-auto pa-scroll p-4 sm:p-6 pa-panel pa-panel-accent" style={{ borderColor: deptData.color + '44', boxShadow: `var(--pa-shadow-lg), 0 0 0 1px ${deptData.color}18` }}>
              <div className="flex items-start gap-4">
                <FluffyAvatar
                  src={floors.find((f) => f.id === selectedFloor)?.npcImg ?? ''}
                  size={68}
                  mood="happy"
                  borderColor={deptData.color}
                  showExpression
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{floors.find((f) => f.id === selectedFloor)?.icon}</span>
                    <p className="text-lg font-extrabold" style={{ color: deptData.color }}>{deptData.name}</p>
                  </div>
                  <p className="text-[11px] font-bold mb-1" style={{ color: deptData.color }}>{deptData.tagline}</p>
                  <p className="text-[10px] leading-relaxed mb-2" style={{ color: '#666' }}>{deptData.mission}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {deptData.coreOutputs.map((f) => (
                      <span key={f} className="px-2 py-0.5 text-[9px] font-bold rounded-full" style={{ backgroundColor: deptData.color + '12', color: deptData.color }}>{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-0 mb-3">
                    {floorNpcs.map((npc, i) => (
                      <div key={npc.id} style={{ marginLeft: i > 0 ? -4 : 0, zIndex: floorNpcs.length - i }} title={`${npc.name} · ${npc.role}`}>
                        <FluffyAvatar src={npc.avatar} size={40} mood={npc.personality} showExpression borderColor={deptData.color} />
                      </div>
                    ))}
                    <span className="text-[9px] font-bold ml-1" style={{ color: '#888' }}>+{npcs.filter((n) => n.departmentId === selectedFloor).length - floorNpcs.length} 位各职级带路人</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t-2" style={{ borderColor: deptData.color + '33' }}>
                <CareerLadder tiers={deptData.careerLadder} color={deptData.color} realScenes={deptData.realScenes} voices={deptData.voices} />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTryWorkDept(selectedFloor)}
                  className="w-full py-3 text-sm pa-btn pa-btn-pink pa-btn-height"
                >
                  📱 干一天试试 · 含黑话讲解
                </motion.button>
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { enterWorkstation(selectedFloor); setSelectedFloor(null); }}
                    className="flex-1 py-3 text-sm pa-btn pa-btn-dept"
                    style={{ background: `linear-gradient(180deg, ${deptData.color}ee, ${deptData.color})` }}
                  >
                    进入工位 · 对话各职级
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedFloor(null)}
                    className="px-4 py-3 text-sm pa-btn pa-btn-cream"
                  >
                    先撤
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tryWorkDept && getWorkMoment(tryWorkDept) && (
          <WorkMomentModal
            moment={getWorkMoment(tryWorkDept)!}
            color={departments.find((d) => d.id === tryWorkDept)?.color ?? 'var(--pa-orange)'}
            onClose={() => setTryWorkDept(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
