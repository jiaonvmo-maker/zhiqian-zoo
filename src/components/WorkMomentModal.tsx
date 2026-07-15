import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { WorkMoment } from '@/data/workMomentTypes';
import { AnalyticsEvents, track } from '@/analytics';
import { useGameStore } from '@/store/gameStore';
import {
  StepKnowledgePanel,
  IntroToolsPanel,
  ToolboxPanel,
  JargonDictionary,
  CompanyContextBanner,
} from '@/components/WorkMomentKnowledge';
import WorkMomentVisual from '@/components/WorkMomentVisual';
import ChoiceReflection from '@/components/ChoiceReflection';

interface ChatLine {
  from: string;
  text: string;
  isUser?: boolean;
}

type Screen = 'intro' | 'playing' | 'ended';

interface WorkMomentModalProps {
  moment: WorkMoment;
  color: string;
  source?: string;
  onClose: () => void;
}

export default function WorkMomentModal({ moment, color, source = 'unknown', onClose }: WorkMomentModalProps) {
  const markWorkMomentComplete = useGameStore((s) => s.markWorkMomentComplete);
  const [screen, setScreen] = useState<Screen>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const [log, setLog] = useState<ChatLine[]>([]);
  const [reflection, setReflection] = useState<{ thought: string; teach?: string | null; nextIdx: number; hasNext: boolean } | null>(null);
  const [waitingChoice, setWaitingChoice] = useState(false);

  const totalSteps = moment.steps.length;
  const currentStep = moment.steps[stepIdx];

  const chatEndRef = useRef<HTMLDivElement>(null);
  const playTopRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    track(AnalyticsEvents.WORK_MOMENT_OPEN, {
      dept_id: moment.deptId,
      title: moment.title,
      source,
      step_count: moment.steps.length,
    });
  }, [moment.deptId, moment.title, moment.steps.length, source]);

  const handleClose = useCallback(() => {
    if (!completedRef.current) {
      track(AnalyticsEvents.WORK_MOMENT_ABANDON, {
        dept_id: moment.deptId,
        source,
        last_step_index: stepIdx,
        progress_pct: Math.round((stepIdx / Math.max(totalSteps, 1)) * 100),
        dwell_ms: Date.now() - openedAtRef.current,
      });
    }
    onClose();
  }, [moment.deptId, onClose, source, stepIdx, totalSteps]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, []);

  const scrollToPlayTop = useCallback(() => {
    requestAnimationFrame(() => {
      playTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const pushPings = useCallback((idx: number) => {
    const step = moment.steps[idx];
    if (!step) return;
    setReflection(null);
    setLog((prev) => [...prev, ...step.pings.map((p) => ({ from: p.from, text: p.text }))]);
    setWaitingChoice(true);
    // 有实景示意时先停在顶部，别一上来滚到聊天底把看板藏掉
    if (step.visual) scrollToPlayTop();
    else scrollToBottom();
  }, [moment.steps, scrollToBottom, scrollToPlayTop]);

  const completeReflection = useCallback(() => {
    if (!reflection) return;
    const { nextIdx, hasNext } = reflection;
    setReflection(null);
    if (hasNext) {
      setStepIdx(nextIdx);
      pushPings(nextIdx);
    } else {
      setScreen('ended');
      completedRef.current = true;
      markWorkMomentComplete(moment.deptId);
      track(AnalyticsEvents.WORK_MOMENT_COMPLETE, {
        dept_id: moment.deptId,
        source,
        step_count: moment.steps.length,
        dwell_ms: Date.now() - openedAtRef.current,
      });
    }
  }, [reflection, pushPings, moment.deptId, moment.steps.length, source, markWorkMomentComplete]);

  const startDay = () => {
    setScreen('playing');
    setStepIdx(0);
    setLog([]);
    track(AnalyticsEvents.WORK_MOMENT_START, { dept_id: moment.deptId, source });
    setTimeout(() => pushPings(0), 400);
  };

  const handleChoice = (choiceIndex: number) => {
    const step = moment.steps[stepIdx];
    if (!step || screen !== 'playing' || !waitingChoice) return;
    const choice = step.choices[choiceIndex];
    if (!choice) return;

    setWaitingChoice(false);
    setLog((prev) => [
      ...prev,
      { from: '你', text: choice.youSay, isUser: true },
      ...(choice.reply ? [{ from: choice.reply.from, text: choice.reply.text }] : []),
    ]);

    scrollToBottom();

    const nextIdx = choice.next ?? stepIdx + 1;
    const hasNext = nextIdx < moment.steps.length && moment.steps[nextIdx];

    setTimeout(() => {
      scrollToBottom();
      setReflection({
        thought: choice.thought,
        teach: choice.teach ?? null,
        nextIdx,
        hasNext: Boolean(hasNext),
      });
    }, 1100);
  };

  const endTag = screen === 'ended'
    ? moment.steps[stepIdx]?.endTag ?? moment.steps[moment.steps.length - 1]?.endTag
    : null;

  const endToolbox = moment.summary.toolbox ?? moment.introTools;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pa-overlay"
      onClick={handleClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40 }}
        className="relative w-full max-w-md h-[88vh] sm:h-[82vh] flex flex-col pa-panel pa-panel-accent overflow-hidden"
        style={{ borderColor: color, borderRadius: 'var(--pa-radius-lg) var(--pa-radius-lg) 0 0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b-2 flex items-center justify-between shrink-0" style={{ borderColor: color + '44' }}>
          <div className="min-w-0">
            <p className="pa-title text-sm truncate">{moment.title} · 干一天试试</p>
            <p className="text-[10px] font-bold truncate" style={{ color: '#888' }}>
              {screen === 'intro'
                ? '术语 + 工具分栏 · 零基础友好'
                : `${moment.role} · 第 ${Math.min(stepIdx + 1, totalSteps)}/${totalSteps} 段`}
            </p>
          </div>
          <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClose} className="pa-icon-btn w-9 h-9 shrink-0">
            <X size={16} style={{ color: 'var(--pa-orange)' }} />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 pa-scroll bg-[var(--pa-paper)]">
          <AnimatePresence mode="wait">
            {screen === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 pb-4">
                <CompanyContextBanner color={color} />

                {moment.sceneNote && (
                  <div className="px-3 py-2 rounded-xl text-[10px] leading-relaxed border-2" style={{ borderColor: color + '44', backgroundColor: color + '0c', color: '#555' }}>
                    🏢 {moment.sceneNote}
                  </div>
                )}

                <p className="text-[13px] leading-relaxed px-1" style={{ color: '#444' }}>{moment.oneLiner}</p>

                <div className="pa-panel p-3" style={{ borderColor: color + '66' }}>
                  <p className="text-[10px] font-extrabold mb-2" style={{ color }}>📅 这一天会经历什么</p>
                  {moment.dayFlow.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2 last:mb-0 items-start">
                      <span className="text-[9px] font-bold shrink-0 w-10 pt-0.5 text-right" style={{ color }}>{f.time}</span>
                      <div className="flex-1 pb-2 border-l-2 pl-2 last:pb-0" style={{ borderColor: color + '44' }}>
                        <p className="text-[11px] font-extrabold" style={{ color: '#333' }}>{f.title}</p>
                        <p className="text-[10px]" style={{ color: '#777' }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {moment.introTools && <IntroToolsPanel tools={moment.introTools} color={color} />}

                <div className="grid grid-cols-2 gap-2">
                  <div className="pa-panel p-2" style={{ borderColor: 'var(--pa-green)' }}>
                    <p className="text-[9px] font-extrabold mb-1" style={{ color: 'var(--pa-green)' }}>可能适合你如果</p>
                    <ul className="space-y-1 list-none pl-0 m-0">
                      {moment.mightLike.map((s) => (
                        <li key={s} className="text-[9px] leading-snug" style={{ color: '#555' }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pa-panel p-2" style={{ borderColor: '#c93d3d55' }}>
                    <p className="text-[9px] font-extrabold mb-1" style={{ color: '#c93d3d' }}>可能会难受如果</p>
                    <ul className="space-y-1 list-none pl-0 m-0">
                      {moment.mightStruggle.map((s) => (
                        <li key={s} className="text-[9px] leading-snug" style={{ color: '#555' }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <motion.button type="button" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={startDay} className="w-full py-3 text-sm pa-btn pa-btn-pink pa-btn-height">
                  好，我进工作群看看 →
                </motion.button>
              </motion.div>
            )}

            {screen === 'playing' && currentStep && (
              <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div ref={playTopRef} className="pa-panel px-3 py-2 mb-2" style={{ borderColor: color }}>
                  <p className="text-[11px] font-extrabold" style={{ color }}>{currentStep.phase}</p>
                  <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#666' }}>{currentStep.phaseTip}</p>
                </div>

                {currentStep.visual && (
                  <WorkMomentVisual key={`${stepIdx}-${currentStep.visual.id}`} visual={currentStep.visual} color={color} />
                )}

                <StepKnowledgePanel
                  key={stepIdx}
                  terms={currentStep.terms}
                  tools={currentStep.tools}
                  legacyJargon={currentStep.jargon}
                  color={color}
                  showCompanyChip
                  defaultOpen={!currentStep.visual}
                />

                <p className="text-[9px] text-center font-bold py-1" style={{ color: '#aaa' }}>— 群消息 —</p>
                {log.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[88%]">
                      {!msg.isUser && (
                        <p className="text-[9px] font-bold mb-0.5 px-1" style={{ color: '#999' }}>{msg.from}</p>
                      )}
                      <div className={`px-3 py-2 text-[13px] leading-relaxed rounded-2xl ${msg.isUser ? 'pa-bubble-user' : 'pa-bubble-npc'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div ref={chatEndRef} className="h-1" />
              </motion.div>
            )}

            {screen === 'ended' && (
              <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pb-4">
                {endTag && (
                  <p className="text-[12px] leading-relaxed text-center px-2" style={{ color: '#555' }}>{endTag}</p>
                )}

                <div className="pa-panel p-3" style={{ borderColor: color }}>
                  <p className="text-[10px] font-extrabold mb-1" style={{ color }}>🗺️ 全流程回顾</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#555' }}>{moment.summary.processRecap}</p>
                </div>

                {endToolbox && <ToolboxPanel tools={endToolbox} color={color} />}
                <JargonDictionary items={moment.summary.keyJargon} color={color} />

                <div className="pa-panel p-3">
                  <p className="text-[10px] font-extrabold mb-2" style={{ color: '#333' }}>🪞 帮你判断：问自己三句</p>
                  {moment.summary.selfCheck.map((q, i) => (
                    <p key={i} className="text-[11px] mb-1.5" style={{ color: '#555' }}>{i + 1}. {q}</p>
                  ))}
                  <p className="text-[11px] leading-relaxed mt-2 pt-2 border-t" style={{ borderColor: '#eee', color: color }}>
                    💡 {moment.summary.verdictHint}
                  </p>
                </div>

                <motion.button type="button" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleClose} className="w-full py-3 text-sm pa-btn pa-btn-cream pa-btn-height">
                  换别的部门再体验一天
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {screen === 'playing' && waitingChoice && currentStep && !reflection && (
          <div className="shrink-0 px-3 py-3 border-t-2 space-y-2" style={{ borderColor: 'var(--pa-brown-light)' }}>
            <p className="text-[10px] font-bold pa-subtitle">哦哦哦</p>
            {currentStep.choices.map((c, i) => (
              <motion.button
                key={i}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(i)}
                className="w-full text-left px-3 py-2.5 text-[12px] pa-btn pa-btn-cream h-auto min-h-0 leading-snug"
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {reflection && (
            <ChoiceReflection
              key={`${stepIdx}-${reflection.thought}`}
              thought={reflection.thought}
              teach={reflection.teach}
              color={color}
              onComplete={completeReflection}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
