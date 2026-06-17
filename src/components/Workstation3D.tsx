import { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useTexture, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { NPC } from '@/types';
import PlushAnimal from '@/components/pa3d/PlushAnimal';
import { breedFromAvatar, moodFromPersonality } from '@/components/pa3d/breeds';
import {
  OFFICE,
  WALL_SEGMENTS,
  FURNITURE,
  DESK_SLOTS,
  planToWorld,
  type FurnitureKind,
} from '@/data/officeLayout';

const SCENE_BG = '#e8e4df';
const WALL = '#ebe4d8';
const CARPET = '#9a9a9a';
const CARPET_LIGHT = '#a8a8a8';
const WOOD = '#c9b8a5';
const WOOD_DARK = '#a89078';

function WallSegment({ x1, z1, x2, z2 }: { x1: number; z1: number; x2: number; z2: number }) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  return (
    <mesh position={[(x1 + x2) / 2, OFFICE.wallH / 2, (z1 + z2) / 2]} rotation={[0, -angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[len, OFFICE.wallH, OFFICE.wallT]} />
      <meshStandardMaterial color={WALL} roughness={0.88} />
    </mesh>
  );
}

function WindowStrip({ x, z, w, rot = 0 }: { x: number; z: number; w: number; rot?: number }) {
  return (
    <mesh position={[x, 1.35, z]} rotation={[0, rot, 0]}>
      <boxGeometry args={[w, 1.1, 0.06]} />
      <meshStandardMaterial color="#c8dce8" roughness={0.15} metalness={0.08} transparent opacity={0.82} />
    </mesh>
  );
}

function Monitor() {
  return (
    <group>
      <mesh position={[0, 0.16, -0.02]} castShadow>
        <boxGeometry args={[0.42, 0.28, 0.03]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.02, -0.02]}>
        <boxGeometry args={[0.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#555" roughness={0.5} />
      </mesh>
    </group>
  );
}

function OfficeChair({ color = '#222' }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.22, 0.08]} castShadow>
        <boxGeometry args={[0.38, 0.06, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.42, -0.08]} castShadow>
        <boxGeometry args={[0.34, 0.42, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
    </group>
  );
}

function StraightDesk({ rot = 0 }: { rot?: number }) {
  return (
    <group rotation={[0, rot, 0]}>
      <RoundedBox args={[1.1, 0.06, 0.55]} radius={0.02} position={[0, 0.52, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={WOOD} roughness={0.58} />
      </RoundedBox>
      {[[-0.45, -0.2], [0.45, -0.2]].map(([lx, lz]) => (
        <mesh key={`${lx}`} position={[lx, 0.26, lz]} castShadow>
          <boxGeometry args={[0.05, 0.52, 0.05]} />
          <meshStandardMaterial color="#888" roughness={0.7} />
        </mesh>
      ))}
      <group position={[0, 0.52, -0.12]}>
        <Monitor />
      </group>
      <group position={[0, 0, 0.28]}>
        <OfficeChair />
      </group>
    </group>
  );
}

function CurvedPod({ rot = 0 }: { rot?: number }) {
  const offsets: { x: number; z: number; r: number }[] = [
    { x: 0, z: -0.35, r: 0 },
    { x: 0.55, z: 0, r: Math.PI / 2 },
    { x: -0.55, z: 0, r: -Math.PI / 2 },
    { x: 0, z: 0.35, r: Math.PI },
  ];

  return (
    <group rotation={[0, rot, 0]}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={WOOD} roughness={0.58} />
      </mesh>
      {offsets.map(({ x, z, r }, i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          <group position={[0, 0, -0.22]}>
            <StraightDesk />
          </group>
        </group>
      ))}
    </group>
  );
}

function ReceptionDesk() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 32, 1, false, 0, Math.PI * 1.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, 0.45, 0.4]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.5]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
      </mesh>
      <group position={[0, 0.5, -0.15]}>
        <Monitor />
      </group>
      <OfficeChair color="#333" />
    </group>
  );
}

function ExecOffice() {
  return (
    <group>
      <RoundedBox args={[1.6, 0.07, 0.85]} radius={0.03} position={[0, 0.52, 0]} castShadow>
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
      </RoundedBox>
      <group position={[0, 0.52, -0.2]}>
        <Monitor />
      </group>
      <OfficeChair color="#111" />
      {[[-0.9, 0.5], [0.9, 0.5]].map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.42, 0.06, 0.42]} />
            <meshStandardMaterial color="#ccc" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.38, -0.05]} castShadow>
            <boxGeometry args={[0.38, 0.32, 0.05]} />
            <meshStandardMaterial color="#bbb" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MeetingRow() {
  return (
    <group>
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.42, 0.06, 0.42]} />
            <meshStandardMaterial color="#bbb" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.38, -0.05]} castShadow>
            <boxGeometry args={[0.38, 0.32, 0.05]} />
            <meshStandardMaterial color="#aaa" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function KitchenCounter() {
  return (
    <group>
      <RoundedBox args={[4.5, 0.9, 0.65]} radius={0.04} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#f2f2f2" roughness={0.4} />
      </RoundedBox>
      <mesh position={[-1.2, 0.55, 0.2]}>
        <boxGeometry args={[0.5, 0.35, 0.4]} />
        <meshStandardMaterial color="#ddd" roughness={0.45} />
      </mesh>
      <mesh position={[0.5, 0.7, 0.15]}>
        <boxGeometry args={[0.35, 0.25, 0.3]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
    </group>
  );
}

function RoundTable() {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 20]} />
        <meshStandardMaterial color="#ddd" roughness={0.55} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.75, 0, Math.sin(a) * 0.75]} rotation={[0, -a, 0]}>
            <OfficeChair color="#666" />
          </group>
        );
      })}
    </group>
  );
}

function Couch() {
  return (
    <group>
      <RoundedBox args={[1.6, 0.35, 0.65]} radius={0.08} position={[0, 0.22, 0]} castShadow>
        <meshStandardMaterial color="#888" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.6, 0.45, 0.12]} radius={0.04} position={[0, 0.42, -0.28]} castShadow>
        <meshStandardMaterial color="#777" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}

function Bookshelf() {
  return (
    <mesh position={[0, 0.9, 0]} castShadow>
      <boxGeometry args={[1.2, 1.8, 0.35]} />
      <meshStandardMaterial color={WOOD_DARK} roughness={0.65} />
    </mesh>
  );
}

function Plant({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.36, 10]} />
        <meshStandardMaterial color="#b89870" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.24, 10, 8]} />
        <meshStandardMaterial color="#5a9a62" roughness={0.55} />
      </mesh>
    </group>
  );
}

function VendingMachine() {
  return (
    <mesh position={[0, 0.95, 0]} castShadow>
      <boxGeometry args={[0.7, 1.9, 0.55]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

function FurniturePiece({ kind, rot = 0 }: { kind: FurnitureKind; rot?: number }) {
  switch (kind) {
    case 'reception': return <ReceptionDesk />;
    case 'execDesk': return <ExecOffice />;
    case 'meetingRow': return <MeetingRow />;
    case 'pod4': return <CurvedPod rot={rot} />;
    case 'pod2': return <StraightDesk rot={rot} />;
    case 'counter': return <KitchenCounter />;
    case 'roundTable': return <RoundTable />;
    case 'couch': return <Couch />;
    case 'bookshelf': return <Bookshelf />;
    case 'plant': return <Plant />;
    case 'vending': return <VendingMachine />;
    default: return null;
  }
}

function FloorPlan() {
  const floorTex = useTexture('/images/office-floor-plan.jpg');
  floorTex.colorSpace = THREE.SRGBColorSpace;
  floorTex.anisotropy = 8;

  // Clean up texture on unmount
  useEffect(() => {
    return () => {
      floorTex.dispose();
    };
  }, [floorTex]);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[OFFICE.w, OFFICE.d]} />
        <meshStandardMaterial color={CARPET} roughness={0.95} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[OFFICE.w, OFFICE.d]} />
        <meshStandardMaterial map={floorTex} transparent opacity={0.22} roughness={1} depthWrite={false} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[4.5, 0.01, -5.5]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={CARPET_LIGHT} roughness={0.85} />
      </mesh>
    </group>
  );
}

function OfficeShell() {
  return (
    <group>
      {WALL_SEGMENTS.map((seg, i) => (
        <WallSegment key={i} x1={seg[0]} z1={seg[1]} x2={seg[2]} z2={seg[3]} />
      ))}

      <WindowStrip x={-11.85} z={0} w={8} rot={Math.PI / 2} />
      <WindowStrip x={0} z={-7.85} w={10} rot={0} />
      <WindowStrip x={11.85} z={-1} w={6} rot={Math.PI / 2} />

      {FURNITURE.map((item, i) => {
        const pos = planToWorld(item.left, item.top);
        return (
          <group key={i} position={[pos.x, 0, pos.z]} rotation={[0, item.rot ?? 0, 0]}>
            <FurniturePiece kind={item.kind} rot={item.rot} />
          </group>
        );
      })}
    </group>
  );
}

function DeskNPC({
  npc,
  slot,
  deptColor,
  isHovered,
  onHover,
  onClick,
}: {
  npc: NPC;
  slot: { x: number; z: number; rot: number };
  deptColor: string;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const breed = useMemo(() => breedFromAvatar(npc.avatar), [npc.avatar]);
  const mood = useMemo(() => moodFromPersonality(npc.personality), [npc.personality]);
  const phase = useMemo(() => npc.id.charCodeAt(0) * 0.13, [npc.id]);

  return (
    <group position={[slot.x, 0, slot.z]} rotation={[0, slot.rot, 0]}>
      <group
        scale={isHovered ? 1.1 : 1}
        onPointerOver={(e) => { e.stopPropagation(); onHover(npc.id); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onClick(npc.id); }}
      >
        <mesh visible={false}>
          <cylinderGeometry args={[0.5, 0.5, 1.1, 10]} />
        </mesh>
        <group position={[0, 0.38, 0.1]} scale={0.5}>
          <PlushAnimal breed={breed} mood={mood} phase={phase} />
        </group>
        {isHovered && (
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.38, 28]} />
            <meshBasicMaterial color={deptColor} transparent opacity={0.65} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Scene({
  npcs,
  deptColor,
  hoveredNPC,
  onHover,
  onSelect,
}: {
  npcs: NPC[];
  deptColor: string;
  hoveredNPC: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 18, 32]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 14, 6]} intensity={1.55} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#fff4e8" />
      <hemisphereLight args={['#fff8f0', '#9a9a9a', 0.35]} />

      <FloorPlan />
      <OfficeShell />

      {npcs.map((npc, i) => (
        <DeskNPC
          key={npc.id}
          npc={npc}
          slot={DESK_SLOTS[i % DESK_SLOTS.length]}
          deptColor={deptColor}
          isHovered={hoveredNPC === npc.id}
          onHover={onHover}
          onClick={onSelect}
        />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.32} scale={28} blur={2.4} far={8} color="#4a4038" />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        minDistance={8}
        maxDistance={22}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

export default function Workstation3D({
  npcs,
  deptColor,
  hoveredNPC,
  onHover,
  onSelect,
}: {
  npcs: NPC[];
  deptColor: string;
  hoveredNPC: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [-14, 11, 14], fov: 32 }}
      style={{ width: '100%', height: '100%', background: SCENE_BG }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(SCENE_BG);
        gl.domElement.style.background = SCENE_BG;
      }}
    >
      <Suspense fallback={null}>
        <Scene
          npcs={npcs}
          deptColor={deptColor}
          hoveredNPC={hoveredNPC}
          onHover={onHover}
          onSelect={onSelect}
        />
      </Suspense>
    </Canvas>
  );
}
