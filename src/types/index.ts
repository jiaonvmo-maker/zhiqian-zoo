export type AppPhase = 'entry' | 'survey' | 'sandbox' | 'workstation' | 'department' | 'meta' | 'salary';

export type ButtonResult = 'success' | 'fire' | 'blame';

export interface UserProfile {
  name: string;
  avatar: string;
  title: string;
  tags: string[];
  bio: string;
  likes: number;
  isVip: boolean;
  traits: string[];
}

export interface CareerTier {
  rank: string;
  roleTitle: string;
  dailyWork: string;
  realityCheck: string;
}

export interface RealWorkScene {
  title: string;
  scene: string;
}

export interface CommunityVoice {
  text: string;
  from: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tagline: string;
  mission: string;
  description: string;
  coreOutputs: string[];
  features: string[];
  chaosLevel: number;
  careerLadder: CareerTier[];
  realScenes: RealWorkScene[];
  voices: CommunityVoice[];
  npcs: string[];
  tasks: Task[];
}

export type CareerTierLevel = 'intern' | 'associate' | 'senior' | 'director' | 'executive';

export interface NPC {
  id: string;
  name: string;
  role: string;
  tier: CareerTierLevel;
  tierLabel: string;
  dailyBrief: string;
  avatar: string;
  departmentId: string;
  personality: 'aggressive' | 'chill' | 'strict' | 'sneaky' | 'energetic' | 'tired';
  lines: string[];
}

export interface ChatMessage {
  id: string;
  npcId: string;
  text: string;
  timestamp: number;
  isUser?: boolean;
  mood?: 'normal' | 'angry' | 'sneaky' | 'tired' | 'strict' | 'energetic' | 'happy' | 'surprised';
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'doing' | 'done';
}

export interface MetaIdea {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  likes: number;
  bookmarks: number;
  status: 'voting' | 'dev' | 'done' | 'dead';
  progress: number;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'project' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actorAvatar?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  options: [string, string];
  traits: [string, string];
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}
