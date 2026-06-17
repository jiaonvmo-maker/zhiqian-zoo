import { create } from 'zustand';
import type { AppPhase, UserProfile, MetaIdea, Notification, ChatMessage, Department } from '@/types';
import { initialMetaIdeas } from '@/data/surveyData';
import { deptMascot } from '@/data/partyAnimalsAssets';

interface GameState {
  phase: AppPhase;
  selectedDept: string | null;
  user: UserProfile | null;
  metaIdeas: MetaIdea[];
  notifications: Notification[];
  unreadCount: number;
  isNight: boolean;
  chaosLevel: number;
  globalTime: string;
  showBadge: boolean;
  showNotifications: boolean;
  departmentMessages: Record<Department['id'], ChatMessage[]>;
  // Actions
  setPhase: (phase: AppPhase) => void;
  selectDepartment: (id: string | null) => void;
  enterWorkstation: (id: string) => void;
  setUser: (user: UserProfile) => void;
  toggleTime: () => void;
  toggleBadge: () => void;
  toggleNotifications: () => void;
  addMetaIdea: (idea: MetaIdea) => void;
  likeIdea: (ideaId: string) => void;
  addNotification: (notification: Notification) => void;
  markRead: (id: string) => void;
  setDepartmentMessages: (deptId: string, messages: ChatMessage[]) => void;
  addDepartmentMessage: (deptId: string, message: ChatMessage) => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'entry',
  selectedDept: null,
  user: null,
  metaIdeas: initialMetaIdeas,
  notifications: [
    {
      id: 'n1',
      type: 'project',
      title: '项目立项通知',
      message: '你投票的"赛博木鱼功德系统"已进入开发阶段',
      timestamp: Date.now() - 3600000,
      read: false,
    },
    {
      id: 'n2',
      type: 'social',
      title: '社交互动',
      message: '赵测试拍了拍你的工牌',
      timestamp: Date.now() - 7200000,
      read: false,
      actorAvatar: deptMascot.tech,
    },
    {
      id: 'n3',
      type: 'system',
      title: '系统公告',
      message: '全公司混乱度上升，当前为暴风雨模式',
      timestamp: Date.now() - 18000000,
      read: true,
    },
  ],
  unreadCount: 2,
  isNight: false,
  chaosLevel: 45,
  globalTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  showBadge: false,
  showNotifications: false,
  departmentMessages: {},

  setPhase: (phase) => set({ phase }),
  selectDepartment: (id) => set({ selectedDept: id, phase: id ? 'department' : 'sandbox' }),
  enterWorkstation: (id) => set({ selectedDept: id, phase: 'workstation' }),
  setUser: (user) => set({ user }),
  toggleTime: () => set((s) => ({ isNight: !s.isNight })),
  toggleBadge: () => set((s) => ({ showBadge: !s.showBadge })),
  toggleNotifications: () => set((s) => ({ showNotifications: !s.showNotifications })),
  
  addMetaIdea: (idea) => set((s) => ({ metaIdeas: [idea, ...s.metaIdeas] })),
  
  likeIdea: (ideaId) => set((s) => ({
    metaIdeas: s.metaIdeas.map((i) =>
      i.id === ideaId ? { ...i, likes: i.likes + 1 } : i
    ),
  })),
  
  addNotification: (notification) => set((s) => ({
    notifications: [notification, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),
  
  markRead: (id) => set((s) => {
    const notif = s.notifications.find((n) => n.id === id);
    if (!notif || notif.read) return s;
    return {
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    };
  }),
  
  setDepartmentMessages: (deptId, messages) => set((s) => ({
    departmentMessages: { ...s.departmentMessages, [deptId]: messages },
  })),
  
  addDepartmentMessage: (deptId, message) => set((s) => ({
    departmentMessages: {
      ...s.departmentMessages,
      [deptId]: [...(s.departmentMessages[deptId] || []), message],
    },
  })),
}));
