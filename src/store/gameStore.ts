import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppPhase, UserProfile, MetaIdea, Notification, ChatMessage, Department } from '@/types';
import { initialMetaIdeas } from '@/data/surveyData';
import { deptMascot } from '@/data/partyAnimalsAssets';
import { AnalyticsEvents, identifySurveyProfile, track } from '@/analytics';

const RESUME_PHASES = new Set<AppPhase>(['sandbox', 'workstation', 'department', 'salary', 'meta']);

interface GameState {
  phase: AppPhase;
  /** 回来时从哪续逛（不恢复成当前 phase，始终先进入口） */
  resumePhase: AppPhase | null;
  selectedDept: string | null;
  user: UserProfile | null;
  visitedDepts: string[];
  completedWorkMoments: string[];
  lastActiveAt: number | null;
  metaIdeas: MetaIdea[];
  notifications: Notification[];
  unreadCount: number;
  isNight: boolean;
  chaosLevel: number;
  globalTime: string;
  showBadge: boolean;
  showNotifications: boolean;
  departmentMessages: Record<Department['id'], ChatMessage[]>;

  setPhase: (phase: AppPhase) => void;
  selectDepartment: (id: string | null) => void;
  enterWorkstation: (id: string) => void;
  setUser: (user: UserProfile) => void;
  markDeptVisited: (deptId: string) => void;
  markWorkMomentComplete: (deptId: string) => void;
  continueJourney: () => void;
  resetProgress: () => void;
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

const seedNotifications: Notification[] = [
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
];

function touchResume(phase: AppPhase) {
  if (!RESUME_PHASES.has(phase)) return {};
  return { resumePhase: phase, lastActiveAt: Date.now() };
}

function uniqPush(list: string[], id: string) {
  return list.includes(id) ? list : [...list, id];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'entry',
      resumePhase: null,
      selectedDept: null,
      user: null,
      visitedDepts: [],
      completedWorkMoments: [],
      lastActiveAt: null,
      metaIdeas: initialMetaIdeas,
      notifications: seedNotifications,
      unreadCount: 2,
      isNight: false,
      chaosLevel: 45,
      globalTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      showBadge: false,
      showNotifications: false,
      departmentMessages: {},

      setPhase: (phase) => {
        const from = get().phase;
        set({ phase, ...touchResume(phase) });
        if (from !== phase) {
          track(AnalyticsEvents.PHASE_CHANGE, { from_phase: from, to_phase: phase, trigger: 'set_phase' }, phase);
        }
      },

      selectDepartment: (id) => {
        const from = get().phase;
        const to: AppPhase = id ? 'department' : 'sandbox';
        set({
          selectedDept: id,
          phase: to,
          visitedDepts: id ? uniqPush(get().visitedDepts, id) : get().visitedDepts,
          ...touchResume(to),
        });
        if (from !== to) {
          track(AnalyticsEvents.PHASE_CHANGE, {
            from_phase: from,
            to_phase: to,
            trigger: 'select_department',
            dept_id: id,
          }, to);
        }
      },

      enterWorkstation: (id) => {
        const from = get().phase;
        set({
          selectedDept: id,
          phase: 'workstation',
          visitedDepts: uniqPush(get().visitedDepts, id),
          ...touchResume('workstation'),
        });
        if (from !== 'workstation') {
          track(AnalyticsEvents.PHASE_CHANGE, {
            from_phase: from,
            to_phase: 'workstation',
            trigger: 'enter_workstation',
            dept_id: id,
          }, 'workstation');
        }
      },

      setUser: (user) => {
        set({ user, lastActiveAt: Date.now() });
        identifySurveyProfile(user.title, user.traits);
        track(AnalyticsEvents.SURVEY_COMPLETE, {
          survey_title: user.title,
          traits: user.traits,
        }, get().phase);
      },

      markDeptVisited: (deptId) => {
        set({
          visitedDepts: uniqPush(get().visitedDepts, deptId),
          lastActiveAt: Date.now(),
        });
      },

      markWorkMomentComplete: (deptId) => {
        set({
          completedWorkMoments: uniqPush(get().completedWorkMoments, deptId),
          visitedDepts: uniqPush(get().visitedDepts, deptId),
          lastActiveAt: Date.now(),
        });
      },

      continueJourney: () => {
        const { resumePhase, selectedDept, user } = get();
        let target: AppPhase = resumePhase && RESUME_PHASES.has(resumePhase) ? resumePhase : 'sandbox';
        if ((target === 'workstation' || target === 'department') && !selectedDept) {
          target = 'sandbox';
        }
        if (!user && target === 'sandbox') {
          /* 没测画像也能续逛大厦 */
        }
        get().setPhase(target);
      },

      resetProgress: () => {
        const from = get().phase;
        set({
          phase: 'entry',
          resumePhase: null,
          selectedDept: null,
          user: null,
          visitedDepts: [],
          completedWorkMoments: [],
          lastActiveAt: null,
          showBadge: false,
          showNotifications: false,
          departmentMessages: {},
        });
        track(AnalyticsEvents.PHASE_CHANGE, {
          from_phase: from,
          to_phase: 'entry',
          trigger: 'reset_progress',
        }, 'entry');
      },

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
    }),
    {
      name: 'pa-progress-v1',
      partialize: (s) => ({
        user: s.user,
        resumePhase: s.resumePhase,
        selectedDept: s.selectedDept,
        visitedDepts: s.visitedDepts,
        completedWorkMoments: s.completedWorkMoments,
        lastActiveAt: s.lastActiveAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          identifySurveyProfile(state.user.title, state.user.traits);
        }
      },
    },
  ),
);

/** 是否有可续的本地档案 */
export function hasSavedProgress(s: Pick<GameState, 'user' | 'visitedDepts' | 'resumePhase' | 'completedWorkMoments'>) {
  return Boolean(
    s.user ||
    s.resumePhase ||
    s.visitedDepts.length > 0 ||
    s.completedWorkMoments.length > 0,
  );
}
