import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PlushAnimal from './PlushAnimal';
import { breedFromAvatar, moodFromPersonality, type PlushBreed, type PlushMood } from './breeds';
import { AVATAR_FRAME, portraitRingStyle, type AvatarVariant } from './avatarFrame';

interface PartyAnimalAvatarProps {
  src: string;
  size?: number;
  mood?: string;
  borderColor?: string;
  onClick?: () => void;
  className?: string;
  /** 是否随性格自动切换神态 */
  animate?: boolean;
  /** avatar=圆框全身像；legs=圆框只露下半身 */
  variant?: AvatarVariant;
}

function Scene({
  breed,
  plushMood,
  phase,
  variant,
}: {
  breed: PlushBreed;
  plushMood: PlushMood;
  phase: number;
  variant: AvatarVariant;
}) {
  const frame = AVATAR_FRAME[variant];

  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2, 5, 3]} intensity={1.6} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} />
      <group position={[0, frame.groupY, 0]} rotation={[0, frame.rotationY, 0]}>
        <PlushAnimal breed={breed} mood={plushMood} scale={frame.scale} phase={phase} />
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
  variant = 'avatar',
}: PartyAnimalAvatarProps) {
  const breed = useMemo(() => breedFromAvatar(src), [src]);
  const plushMood = useMemo(() => moodFromPersonality(mood), [mood]);
  const [phase] = useState(() => Math.random() * Math.PI * 2);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = AVATAR_FRAME[variant];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !animate) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  const zoom = size * frame.zoomMul;

  const inner = (
    <div
      ref={wrapRef}
      className={`relative flex-shrink-0 inline-block overflow-hidden ${onClick ? '' : className}`}
      style={portraitRingStyle(size, borderColor)}
    >
      <Canvas
        orthographic
        camera={{ position: [0, frame.cameraY, 8], zoom, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        frameloop={visible && animate ? 'always' : 'demand'}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, display: 'block' }}
      >
        <Suspense fallback={null}>
          <Scene breed={breed} plushMood={plushMood} phase={phase} variant={variant} />
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
        style={{ width: size, height: size }}
      >
        {inner}
      </button>
    );
  }

  return inner;
}
