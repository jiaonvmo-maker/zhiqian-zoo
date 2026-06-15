import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PlushAnimal from './PlushAnimal';
import { breedFromAvatar, moodFromPersonality, type PlushBreed, type PlushMood } from './breeds';

interface PartyAnimalAvatarProps {
  src: string;
  size?: number;
  mood?: string;
  borderColor?: string;
  onClick?: () => void;
  className?: string;
  /** 是否随性格自动切换神态 */
  animate?: boolean;
}

function Scene({ breed, plushMood, phase }: { breed: PlushBreed; plushMood: PlushMood; phase: number }) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2, 5, 3]} intensity={1.6} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} />
      <group position={[0, -0.35, 0]} rotation={[0, 0.35, 0]}>
        <PlushAnimal breed={breed} mood={plushMood} scale={1} phase={phase} />
      </group>
    </>
  );
}

/** 单角色 3D 头像视窗 — 猛兽派对风圆框 + 实时动画 */
export default function PartyAnimalAvatar({
  src,
  size = 48,
  mood = 'normal',
  borderColor = 'var(--pa-orange)',
  onClick,
  className = '',
  animate = true,
}: PartyAnimalAvatarProps) {
  const breed = useMemo(() => breedFromAvatar(src), [src]);
  const plushMood = useMemo(() => moodFromPersonality(mood), [mood]);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !animate) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  const h = Math.round(size * 0.92);
  const inner = (
    <div
      ref={wrapRef}
      className={`relative flex-shrink-0 inline-block overflow-hidden rounded-full ${onClick ? '' : className}`}
      style={{
        width: size,
        height: h,
        border: `3px solid ${borderColor}`,
        boxShadow: `0 2px 0 ${borderColor}66, 0 4px 10px rgba(0,0,0,0.08)`,
        background: 'linear-gradient(180deg, #e8f6fc 0%, #fff9f2 100%)',
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0.55, 4], zoom: size * 1.35, near: 0.1, far: 20 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        frameloop={visible && animate ? 'always' : 'demand'}
        style={{ width: size, height: h, display: 'block' }}
      >
        <Suspense fallback={null}>
          <Scene breed={breed} plushMood={plushMood} phase={phase} />
        </Suspense>
      </Canvas>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-block p-0 border-none bg-transparent cursor-pointer ${className}`}
        style={{ width: size, height: h }}
      >
        {inner}
      </button>
    );
  }

  return inner;
}
