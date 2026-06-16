import { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
  { id: 'management', name: '管理层', color: '#c9a227', icon: '👑', npcImg: deptMascot.management },
  { id: 'legal', name: '法务部', color: '#8e8e93', icon: '⚖️', npcImg: deptMascot.legal },
  { id: 'finance', name: '财务部', color: '#00c7be', icon: '💵', npcImg: deptMascot.finance },
  { id: 'design', name: '设计部', color: '#ff2d55', icon: '🎨', npcImg: deptMascot.design },
  { id: 'product', name: '产品部', color: '#34c759', icon: '💡', npcImg: deptMascot.product },
  { id: 'commercial', name: '商业化', color: '#af52de', icon: '💰', npcImg: deptMascot.commercial },
  { id: 'tech', name: '技术部', color: '#007aff', icon: '💻', npcImg: deptMascot.tech },
  { id: 'data', name: '数据部', color: '#ff6b35', icon: '📊', npcImg: deptMascot.data },
  { id: 'operation', name: '运营部', color: '#ff9500', icon: '📢', npcImg: deptMascot.operation },
  { id: 'hr', name: '人事部', color: '#5856d6', icon: '👥', npcImg: deptMascot.hr },
  { id: 'support', name: '支持部', color: '#64d2ff', icon: '🎧', npcImg: deptMascot.support },
].reverse();

type Floor = (typeof floors)[number];

const SCENE_BG = '#f7ebdd';
const TOWER_WIDTH = 4.35;
const TOWER_DEPTH = 3.05;
const FLOOR_HEIGHT = 0.36;
const FLOOR_GAP = 0.055;

function softenColor(hex: string, amount = 0.32) {
  return new THREE.Color(hex).lerp(new THREE.Color('#fff9f4'), amount).getStyle();
}

function floorY(index: number) {
  return index * (FLOOR_HEIGHT + FLOOR_GAP) + 0.34;
}

function createLabelTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 80;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 36px system-ui, "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(74, 63, 53, 0.85)';
  ctx.strokeText(text, 12, canvas.height / 2);
  ctx.fillStyle = '#fffef8';
  ctx.fillText(text, 12, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function FloorLabel({ text }: { text: string }) {
  const texture = useMemo(() => createLabelTexture(text), [text]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[-0.68, 0.03, TOWER_DEPTH / 2 + 0.04]} renderOrder={2}>
      <planeGeometry args={[1.35, 0.34]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
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
  const y = floorY(index);
  const active = hovered || selected;
  const bodyColor = active ? floor.color : softenColor(floor.color);
  const lift = active ? 0.08 : 0;

  return (
    <group position={[0, y + lift, 0]}>
      <mesh position={[0, -(FLOOR_HEIGHT + FLOOR_GAP) / 2 + 0.01, 0]} receiveShadow>
        <boxGeometry args={[TOWER_WIDTH + 0.06, FLOOR_GAP, TOWER_DEPTH + 0.06]} />
        <meshStandardMaterial color="#fffdf9" roughness={0.92} />
      </mesh>

      <RoundedBox
        args={[TOWER_WIDTH, FLOOR_HEIGHT, TOWER_DEPTH]}
        radius={0.08}
        smoothness={6}
        castShadow
        receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); onHover(floor.id); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onSelect(floor.id); }}
        scale={active ? 1.03 : 1}
      >
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.38}
          metalness={0.02}
          emissive={active ? floor.color : '#000000'}
          emissiveIntensity={active ? 0.14 : 0}
        />
      </RoundedBox>

      <mesh position={[-TOWER_WIDTH / 2 + 0.18, 0.02, TOWER_DEPTH / 2 + 0.015]} castShadow>
        <boxGeometry args={[0.1, FLOOR_HEIGHT * 0.72, 0.03]} />
        <meshStandardMaterial color={floor.color} roughness={0.35} />
      </mesh>

      <FloorLabel text={floor.name} />

      {active && (
        <mesh position={[0, 0, TOWER_DEPTH / 2 + 0.04]} rotation={[0, 0, 0]}>
          <ringGeometry args={[TOWER_WIDTH * 0.22, TOWER_WIDTH * 0.26, 32]} />
          <meshBasicMaterial color={floor.color} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function TowerCrown({ topY }: { topY: number }) {
  const breed = useMemo(() => breedFromAvatar(deptMascot.management), []);
  return (
    <group position={[0, topY, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.05, 1.2, 0.22, 24]} />
        <meshStandardMaterial color="#fff8ef" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.72, 24, 18]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.48} />
      </mesh>
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.35}>
        <group position={[0, 1.05, 0]} scale={0.62}>
          <PlushAnimal breed={breed} mood="happy" phase={0.2} />
        </group>
      </Float>
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
  const towerTop = floorY(floors.length - 1) + FLOOR_HEIGHT + 0.2;

  return (
    <Canvas
      shadows
      camera={{ position: [5.4, 4.2, 6.8], fov: 36 }}
      style={{ width: '100%', height: '100%', background: SCENE_BG }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(SCENE_BG);
        gl.domElement.style.background = SCENE_BG;
      }}
    >
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 14, 28]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[6, 10, 4]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-5, 5, -4]} intensity={0.55} color="#fff4e8" />
      <pointLight position={[0, 3, 4]} intensity={0.35} color="#ffe8d6" />

      <group position={[0, -2.75, 0]} rotation={[0, -0.35, 0]}>
        <mesh receiveShadow position={[0, -0.08, 0]}>
          <cylinderGeometry args={[3.2, 3.55, 0.2, 32]} />
          <meshStandardMaterial color="#efe2d4" roughness={0.95} />
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

        <TowerCrown topY={towerTop} />
      </group>

      <ContactShadows position={[0, -3.02, 0]} opacity={0.28} scale={12} blur={2.4} far={8} color="#6b5d4f" />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.05, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#efe4d8" roughness={1} />
      </mesh>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={5.5}
        maxDistance={10.5}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 2.08}
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
      <div className="absolute inset-0 pt-16" style={{ width: '100%', height: 'calc(100vh - 4rem)', background: SCENE_BG }}>
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
            <div className="w-full max-w-xl max-h-[72vh] flex flex-col pa-panel pa-panel-accent overflow-hidden" style={{ borderColor: deptData.color + '44', boxShadow: `var(--pa-shadow-lg), 0 0 0 1px ${deptData.color}18` }}>
              <div className="relative shrink-0 p-4 sm:p-6 pb-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedFloor(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 pa-icon-btn w-9 h-9 z-10"
                  aria-label="关闭"
                >
                  <X size={16} style={{ color: deptData.color }} />
                </motion.button>
                <div className="flex items-start gap-4 pr-8">
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
                    <div className="flex items-center gap-0">
                      {floorNpcs.map((npc, i) => (
                        <div key={npc.id} style={{ marginLeft: i > 0 ? -4 : 0, zIndex: floorNpcs.length - i }} title={`${npc.name} · ${npc.role}`}>
                          <FluffyAvatar src={npc.avatar} size={40} mood={npc.personality} showExpression borderColor={deptData.color} />
                        </div>
                      ))}
                      <span className="text-[9px] font-bold ml-1" style={{ color: '#888' }}>+{npcs.filter((n) => n.departmentId === selectedFloor).length - floorNpcs.length} 位各职级带路人</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pa-scroll px-4 sm:px-6 pt-3 border-t-2" style={{ borderColor: deptData.color + '33' }}>
                <CareerLadder tiers={deptData.careerLadder} color={deptData.color} realScenes={deptData.realScenes} voices={deptData.voices} />
              </div>

              <div className="shrink-0 flex flex-col gap-2 p-4 sm:p-6 pt-3 border-t-2" style={{ borderColor: deptData.color + '33' }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTryWorkDept(selectedFloor)}
                  className="w-full py-3 text-sm pa-btn pa-btn-pink pa-btn-height"
                >
                  🎭 干一天试试 · 含黑话讲解
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
