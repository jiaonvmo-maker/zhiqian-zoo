import PartyAnimalAvatar from '@/components/pa3d/PartyAnimalAvatar';
import { portraitRingStyle } from '@/components/pa3d/avatarFrame';
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
  const ring = portraitRingStyle(w, borderColor ?? 'var(--pa-orange)');

  const img = (
    <div
      className={`relative flex-shrink-0 inline-block overflow-hidden ${onClick ? '' : className ?? ''}`}
      style={ring}
    >
      <img
        src={assetUrl(src || defaultAvatar)}
        alt={alt}
        draggable={false}
        className="absolute inset-0 m-auto w-[88%] h-[88%] object-contain object-center"
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
