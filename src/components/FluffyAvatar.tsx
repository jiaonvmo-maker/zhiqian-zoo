import PartyAnimalAvatar from '@/components/pa3d/PartyAnimalAvatar';
import { moodFromPersonality } from '@/components/pa3d/breeds';
import { assetUrl, defaultAvatar } from '@/data/partyAnimalsAssets';

interface FluffyAvatarProps {
  src: string;
  alt?: string;
  size?: number;
  mood?: string;
  borderColor?: string;
  onClick?: () => void;
  className?: string;
  showExpression?: boolean;
  variant?: 'avatar' | 'legs';
  /** 3d=实时毛绒；photo=PNG 立绘（群聊等密集场景更稳） */
  mode?: '3d' | 'photo';
}

function PhotoAvatar({
  src,
  alt = '',
  size,
  borderColor,
  onClick,
  className,
}: Pick<FluffyAvatarProps, 'src' | 'alt' | 'size' | 'borderColor' | 'onClick' | 'className'>) {
  const w = size ?? 48;
  const frameStyle = {
    width: w,
    height: w,
    borderRadius: '50%',
    border: `3px solid ${borderColor ?? 'var(--pa-orange)'}`,
    boxShadow: `0 2px 0 ${borderColor ?? 'var(--pa-orange)'}66, 0 4px 10px rgba(0,0,0,0.08)`,
    background: 'linear-gradient(180deg, #e8f6fc 0%, #fff9f2 100%)',
  };

  const img = (
    <div
      className={`relative flex-shrink-0 inline-block overflow-hidden ${onClick ? '' : className ?? ''}`}
      style={frameStyle}
    >
      <img
        src={assetUrl(src || defaultAvatar)}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover object-[center_20%]"
        onError={(e) => {
          const imgEl = e.currentTarget;
          if (imgEl.dataset.fallback) return;
          imgEl.dataset.fallback = '1';
          imgEl.src = assetUrl(defaultAvatar);
        }}
      />
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-block p-0 border-none bg-transparent cursor-pointer ${className ?? ''}`}
        style={{ width: w, height: w }}
      >
        {img}
      </button>
    );
  }

  return img;
}

/** 全站统一 3D 毛绒头像 — 猛兽派对风会动角色 */
export default function FluffyAvatar({
  src,
  alt,
  size = 48,
  mood = 'normal',
  borderColor = 'var(--pa-orange)',
  onClick,
  className = '',
  showExpression = true,
  variant = 'avatar',
  mode = '3d',
}: FluffyAvatarProps) {
  if (mode === 'photo') {
    return (
      <PhotoAvatar
        src={src}
        alt={alt}
        size={size}
        borderColor={borderColor}
        onClick={onClick}
        className={className}
      />
    );
  }

  const plushMood = showExpression ? mood : 'chill';

  return (
    <PartyAnimalAvatar
      src={src}
      size={size}
      mood={plushMood}
      borderColor={borderColor}
      onClick={onClick}
      className={className}
      animate
      variant={variant}
    />
  );
}

export { moodFromPersonality };
