import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlushBreed, PlushMood } from './breeds';
import { breedPalettes, breedShapes } from './breeds';

interface PlushAnimalProps {
  breed: PlushBreed;
  mood?: PlushMood;
  scale?: number;
  phase?: number;
}

function EarPair({ breed, pal }: { breed: PlushBreed; pal: { main: string; belly: string } }) {
  const shape = breedShapes[breed];
  if (shape.ear === 'none') return null;

  const spread = 0.16;
  const yOff = 0.24;

  if (shape.ear === 'pointy') {
    return (
      <group>
        <mesh position={[-spread, yOff, 0]} rotation={[0, 0, -0.2]} castShadow>
          <coneGeometry args={[0.07, 0.2, 10]} />
          <meshStandardMaterial color={pal.main} roughness={0.48} />
        </mesh>
        <mesh position={[spread, yOff, 0]} rotation={[0, 0, 0.2]} castShadow>
          <coneGeometry args={[0.07, 0.2, 10]} />
          <meshStandardMaterial color={pal.main} roughness={0.48} />
        </mesh>
      </group>
    );
  }

  if (shape.ear === 'floppy') {
    return (
      <group>
        <mesh position={[-spread, yOff - 0.02, 0.02]} rotation={[0.3, 0, -0.5]} castShadow>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color={pal.main} roughness={0.5} />
        </mesh>
        <mesh position={[spread, yOff - 0.02, 0.02]} rotation={[0.3, 0, 0.5]} castShadow>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color={pal.main} roughness={0.5} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[-spread, yOff, 0]} castShadow>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color={pal.main} roughness={0.48} />
      </mesh>
      <mesh position={[spread, yOff, 0]} castShadow>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color={pal.main} roughness={0.48} />
      </mesh>
    </group>
  );
}

/** 猛兽派对风 3D 毛绒角色 — 圆胖、会动、神态夸张 */
export default function PlushAnimal({ breed, mood = 'idle', scale = 1, phase = 0 }: PlushAnimalProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Mesh>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const leftBrow = useRef<THREE.Mesh>(null);
  const rightBrow = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  const pal = breedPalettes[breed];
  const shape = breedShapes[breed];
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.42, metalness: 0.02 }), [pal.main]);
  const bellyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.5 }), [pal.belly]);
  const secMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pal.sec, roughness: 0.4 }), [pal.sec]);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    const g = root.current;
    const hd = head.current;
    const la = leftArm.current;
    const ra = rightArm.current;
    const tl = tail.current;
    const le = leftEye.current;
    const re = rightEye.current;
    const lb = leftBrow.current;
    const rb = rightBrow.current;
    const mo = mouth.current;
    const bd = body.current;
    if (!g || !hd || !la || !ra || !le || !re || !lb || !rb || !mo || !bd) return;

    // 眨眼（派对风圆眼）
    const blink = Math.sin(t * 0.4) > 0.97 ? 0.12 : 1;
    le.scale.y = blink;
    re.scale.y = blink;

    // 默认复位
    g.position.set(0, 0, 0);
    g.rotation.set(0, 0, 0);
    g.scale.set(scale, scale, scale);
    hd.rotation.set(0, 0, 0);
    lb.rotation.z = 0;
    rb.rotation.z = 0;
    (bd.material as THREE.MeshStandardMaterial).emissive.setRGB(0, 0, 0);

    switch (mood) {
      case 'idle': {
        const bob = Math.sin(t * 2.2) * 0.03;
        g.position.y = bob;
        // 派对风呼吸 squash
        const breath = 1 + Math.sin(t * 2.2) * 0.04;
        g.scale.set(scale * (1 + (1 - breath) * 0.3), scale * breath, scale);
        hd.rotation.y = Math.sin(t * 0.9) * 0.1;
        hd.rotation.x = Math.sin(t * 1.4) * 0.04;
        la.rotation.set(-0.3, 0, 0.35 + Math.sin(t * 2) * 0.06);
        ra.rotation.set(-0.3, 0, -0.35 - Math.sin(t * 2 + 0.5) * 0.06);
        mo.position.y = -0.1;
        mo.scale.set(1, 0.6, 1);
        if (tl) tl.rotation.y = Math.sin(t * 2.5) * 0.2;
        break;
      }
      case 'happy':
      case 'dancing': {
        const bounce = Math.abs(Math.sin(t * 5.5));
        g.position.y = bounce * 0.22;
        // squash & stretch
        const sy = 1 - bounce * 0.15;
        const sx = 1 + bounce * 0.1;
        g.scale.set(scale * sx, scale * sy, scale);
        g.rotation.y = Math.sin(t * 2.8) * 0.15;
        la.rotation.set(-0.5, 0, 2.2 + Math.sin(t * 8) * 0.35);
        ra.rotation.set(-0.5, 0, -2.2 - Math.sin(t * 8) * 0.35);
        hd.rotation.x = -0.15 + Math.sin(t * 6) * 0.12;
        mo.position.y = -0.08;
        mo.scale.set(1.3, 1.1, 1);
        if (tl) tl.rotation.y = Math.sin(t * 10) * 0.6;
        break;
      }
      case 'angry': {
        g.position.x = Math.sin(t * 16) * 0.05;
        g.rotation.z = Math.sin(t * 14) * 0.03;
        la.rotation.set(0.2, 0, 0.9 + Math.sin(t * 12) * 0.5);
        ra.rotation.set(0.2, 0, -0.9 - Math.sin(t * 12) * 0.5);
        hd.rotation.x = 0.12;
        hd.rotation.z = Math.sin(t * 12) * 0.08;
        lb.rotation.z = 0.45;
        rb.rotation.z = -0.45;
        le.scale.y = 0.7;
        re.scale.y = 0.7;
        mo.position.y = -0.12;
        mo.scale.set(0.8, 1.2, 1);
        (bd.material as THREE.MeshStandardMaterial).emissive.setRGB(0.15, 0, 0);
        if (tl) tl.rotation.y = Math.sin(t * 14) * 0.4;
        break;
      }
      case 'tired': {
        g.rotation.x = 0.15;
        g.position.y = -0.05;
        hd.rotation.x = 0.38 + Math.sin(t * 0.6) * 0.04;
        la.rotation.set(0.5, 0, 0.15);
        ra.rotation.set(0.5, 0, -0.15);
        le.scale.y = 0.45;
        re.scale.y = 0.45;
        lb.rotation.z = -0.2;
        rb.rotation.z = 0.2;
        mo.position.y = -0.11;
        mo.scale.set(0.7, 0.5, 1);
        break;
      }
      case 'typing': {
        g.position.y = Math.sin(t * 18) * 0.012;
        la.rotation.set(-0.85, 0, 0.2 + Math.sin(t * 14) * 0.25);
        ra.rotation.set(-0.85, 0, -0.2 - Math.sin(t * 15) * 0.25);
        hd.rotation.x = 0.28;
        hd.rotation.y = Math.sin(t * 1.5) * 0.05;
        mo.scale.set(0.9, 0.7, 1);
        break;
      }
      case 'sneaky': {
        g.position.y = Math.sin(t * 1.2) * 0.02;
        hd.rotation.z = 0.18;
        hd.rotation.y = Math.sin(t * 0.7) * 0.15;
        le.scale.y = 0.55;
        re.scale.y = 0.55;
        lb.rotation.z = -0.15;
        rb.rotation.z = 0.15;
        la.rotation.set(-0.2, 0, 0.5);
        ra.rotation.set(-0.4, 0.3, -0.3);
        mo.position.y = -0.09;
        mo.scale.set(1.2, 0.5, 1);
        if (tl) tl.rotation.y = Math.sin(t * 3) * 0.25;
        break;
      }
      case 'chill': {
        const sway = Math.sin(t * 1.1) * 0.025;
        g.position.y = sway;
        g.rotation.z = Math.sin(t * 0.8) * 0.04;
        hd.rotation.y = Math.sin(t * 0.6) * 0.12;
        la.rotation.set(-0.15, 0, 0.25);
        ra.rotation.set(-0.15, 0, -0.25);
        mo.scale.set(1, 0.5, 1);
        break;
      }
    }
  });

  return (
    <group ref={root}>
      {/* 身体 */}
      <mesh ref={body} position={[0, 0.42, 0]} castShadow material={bodyMat}>
        <sphereGeometry args={[0.38, 22, 18]} />
      </mesh>
      <mesh position={[0, 0.38, 0.22]} scale={[1, 0.9, 0.5]} material={bellyMat}>
        <sphereGeometry args={[0.26, 16, 12]} />
      </mesh>

      {/* 背脊装饰 */}
      {shape.spikes && (
        <group position={[0, 0.55, -0.12]}>
          {[-0.12, 0, 0.12].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0.4, 0, 0]} material={secMat}>
              <coneGeometry args={[0.05, 0.12, 6]} />
            </mesh>
          ))}
        </group>
      )}
      {shape.stripe && (
        <mesh position={[0, 0.5, 0.18]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.35, 0.02]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      )}

      {/* 头 */}
      <group ref={head} position={[0, 0.78, 0]}>
        <mesh castShadow material={bodyMat}>
          <sphereGeometry args={[0.28, 22, 18]} />
        </mesh>

        {/* 熊猫眼圈 */}
        {breed === 'panda' && (
          <>
            <mesh position={[-0.1, 0.04, 0.2]}>
              <sphereGeometry args={[0.09, 12, 10]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0.04, 0.2]}>
              <sphereGeometry args={[0.09, 12, 10]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
          </>
        )}

        <EarPair breed={breed} pal={pal} />

        {shape.horn && (
          <mesh position={[0, 0.32, 0.02]} rotation={[0.1, 0, 0]}>
            <coneGeometry args={[0.04, 0.22, 8]} />
            <meshStandardMaterial color={pal.accent ?? '#e8c4ff'} roughness={0.3} metalness={0.15} />
          </mesh>
        )}

        {/* 脸颊 */}
        <mesh position={[-0.18, -0.06, 0.18]} scale={[1, 0.8, 0.6]} material={bellyMat}>
          <sphereGeometry args={[0.11, 12, 10]} />
        </mesh>
        <mesh position={[0.18, -0.06, 0.18]} scale={[1, 0.8, 0.6]} material={bellyMat}>
          <sphereGeometry args={[0.11, 12, 10]} />
        </mesh>

        {/* 眼睛 */}
        <group ref={leftEye} position={[-0.1, 0.04, 0.22]}>
          <mesh>
            <sphereGeometry args={[0.07, 14, 14]} />
            <meshStandardMaterial color="#fff" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
          </mesh>
          <mesh position={[0.02, 0.03, 0.07]}>
            <sphereGeometry args={[0.014, 6, 6]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        </group>
        <group ref={rightEye} position={[0.1, 0.04, 0.22]}>
          <mesh>
            <sphereGeometry args={[0.07, 14, 14]} />
            <meshStandardMaterial color="#fff" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
          </mesh>
          <mesh position={[0.02, 0.03, 0.07]}>
            <sphereGeometry args={[0.014, 6, 6]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        </group>

        {/* 眉毛 */}
        <mesh ref={leftBrow} position={[-0.1, 0.14, 0.24]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.012, 0.06, 4, 6]} />
          <meshStandardMaterial color={pal.sec} roughness={0.5} />
        </mesh>
        <mesh ref={rightBrow} position={[0.1, 0.14, 0.24]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.012, 0.06, 4, 6]} />
          <meshStandardMaterial color={pal.sec} roughness={0.5} />
        </mesh>

        {/* 鼻子 */}
        <mesh position={[0, -0.06, 0.3]} material={secMat}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>

        {/* 嘴巴 */}
        <mesh ref={mouth} position={[0, -0.1, 0.28]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#cc6666" roughness={0.4} />
        </mesh>
      </group>

      {/* 手臂 */}
      <mesh ref={leftArm} position={[-0.32, 0.45, 0.12]} castShadow material={bodyMat}>
        <capsuleGeometry args={[0.07, 0.18, 8, 12]} />
      </mesh>
      <mesh ref={rightArm} position={[0.32, 0.45, 0.12]} castShadow material={bodyMat}>
        <capsuleGeometry args={[0.07, 0.18, 8, 12]} />
      </mesh>

      {/* 腿 */}
      <mesh position={[-0.15, 0.06, 0.2]} scale={[1, 0.6, 1.2]} material={secMat}>
        <sphereGeometry args={[0.1, 10, 8]} />
      </mesh>
      <mesh position={[0.15, 0.06, 0.2]} scale={[1, 0.6, 1.2]} material={secMat}>
        <sphereGeometry args={[0.1, 10, 8]} />
      </mesh>

      {/* 尾巴 */}
      {shape.tail !== 'none' && (
        <mesh
          ref={tail}
          position={[0, shape.tail === 'long' ? 0.5 : 0.35, -0.35]}
          rotation={shape.tail === 'long' ? [-0.8, 0, 0] : [0, 0, 0]}
          material={secMat}
        >
          {shape.tail === 'long' ? (
            <coneGeometry args={[0.1, 0.32, 10]} />
          ) : (
            <sphereGeometry args={[0.08, 10, 8]} />
          )}
        </mesh>
      )}
    </group>
  );
}
