import PartyAnimalAvatar from '@/components/pa3d/PartyAnimalAvatar';
import { moodFromPersonality } from '@/components/pa3d/breeds';

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
}

/** 全站统一 3D 毛绒头像 — 猛兽派对风会动角色 */
export default function FluffyAvatar({
  src,
  size = 48,
  mood = 'normal',
  borderColor = 'var(--pa-orange)',
  onClick,
  className = '',
  showExpression = true,
  variant = 'avatar',
}: FluffyAvatarProps) {
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
