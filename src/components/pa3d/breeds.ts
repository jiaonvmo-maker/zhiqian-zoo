/** 猛兽派对风格 3D 毛绒品种配置 */

export type PlushBreed =
  | 'gorilla'
  | 'unicorn'
  | 'panda'
  | 'cat'
  | 'dog'
  | 'dino'
  | 'fox'
  | 'tiger'
  | 'croc'
  | 'duck';

export type PlushMood = 'idle' | 'happy' | 'angry' | 'tired' | 'typing' | 'sneaky' | 'chill' | 'dancing';

export interface BreedPalette {
  main: string;
  sec: string;
  belly: string;
  accent?: string;
}

export const breedPalettes: Record<PlushBreed, BreedPalette> = {
  gorilla: { main: '#6b5a4a', sec: '#4a3d32', belly: '#8a7560' },
  unicorn: { main: '#f0e6ff', sec: '#c9a0ff', belly: '#fff8ff', accent: '#e8b4ff' },
  panda: { main: '#f5f5f5', sec: '#2a2a2a', belly: '#ffffff' },
  cat: { main: '#f0a050', sec: '#d08030', belly: '#ffd8a8' },
  dog: { main: '#e8a866', sec: '#c48844', belly: '#f5d4a8' },
  dino: { main: '#6bc04a', sec: '#3d8a28', belly: '#a8e878' },
  fox: { main: '#e87830', sec: '#b85818', belly: '#f5e0c8' },
  tiger: { main: '#ff9922', sec: '#2a2a2a', belly: '#ffddaa' },
  croc: { main: '#44aa66', sec: '#227744', belly: '#88cc99' },
  duck: { main: '#ffdd44', sec: '#ff9922', belly: '#fff8cc' },
};

export type EarStyle = 'round' | 'pointy' | 'floppy' | 'tiny' | 'none';

export interface BreedShape {
  ear: EarStyle;
  tail: 'none' | 'stub' | 'fluffy' | 'long';
  horn?: boolean;
  spikes?: boolean;
  stripe?: boolean;
}

export const breedShapes: Record<PlushBreed, BreedShape> = {
  gorilla: { ear: 'round', tail: 'none' },
  unicorn: { ear: 'pointy', tail: 'fluffy', horn: true },
  panda: { ear: 'round', tail: 'stub' },
  cat: { ear: 'pointy', tail: 'long' },
  dog: { ear: 'floppy', tail: 'stub' },
  dino: { ear: 'none', tail: 'long', spikes: true },
  fox: { ear: 'pointy', tail: 'fluffy' },
  tiger: { ear: 'round', tail: 'long', stripe: true },
  croc: { ear: 'none', tail: 'long' },
  duck: { ear: 'none', tail: 'stub' },
};

const avatarBreedMap: Record<string, PlushBreed> = {
  'pa-gorilla': 'gorilla',
  'pa-unicorn': 'unicorn',
  'pa-panda': 'panda',
  'pa-cat': 'cat',
  'pa-corgi': 'dog',
  'pa-dog': 'dog',
  'pa-dino': 'dino',
  'pa-fox': 'fox',
  'pa-tiger': 'tiger',
  'pa-croc': 'croc',
  'pa-duck': 'duck',
};

export function breedFromAvatar(src: string): PlushBreed {
  for (const [key, breed] of Object.entries(avatarBreedMap)) {
    if (src.includes(key)) return breed;
  }
  return 'dog';
}

/** 性格 → 派对风神态动画 */
export function moodFromPersonality(personality: string): PlushMood {
  const map: Record<string, PlushMood> = {
    energetic: 'happy',
    tired: 'tired',
    strict: 'angry',
    sneaky: 'sneaky',
    chill: 'chill',
    happy: 'happy',
    angry: 'angry',
    normal: 'idle',
    surprised: 'happy',
  };
  return map[personality] ?? 'idle';
}
