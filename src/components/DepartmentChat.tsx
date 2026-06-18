import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { departments } from '@/data/departments';
import { npcs } from '@/data/npcs';
import { generateChatScript, getNPCReply, QUICK_REPLIES } from '@/data/chatScripts';
import WorkMomentModal from './WorkMomentModal';
import { getWorkMoment } from '@/data/workMoments';
import CyberBadge from './CyberBadge';
import PrivateChat from './PrivateChat';
import FluffyAvatar from './FluffyAvatar';
import { defaultAvatar } from '@/data/partyAnimalsAssets';

export default function DepartmentChat() {
  const { selectedDept, selectDepartment, showBadge, addNotification } = useGameStore();
  const [messages, setMessages] = useState<import('@/types').ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [tryWork, setTryWork] = useState(false);
  const [historyReady, setHistoryReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  const revealCleanupRef = useRef<(() => void) | null>(null);

  const dept = departments.find((d) => d.id === selectedDept);

  useEffect(() => {
    if (!dept) return;

    setMessages([]);
    setHistoryReady(false);

    const script = generateChatScript(dept.id);
    if (script.length === 0) {
      setHistoryReady(true);
      return;
    }

    let cancelled = false;
    let idx = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const clearAll = () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    revealCleanupRef.current = clearAll;

    const revealNext = () => {
      if (cancelled || idx >= script.length) {
        if (!cancelled) setHistoryReady(true);
        return;
      }

      const next = script[idx];
      setMessages((prev) => [...prev, next]);
      idx += 1;
      if (idx >= script.length) {
        setHistoryReady(true);
        return;
      }
      timeouts.push(setTimeout(revealNext, 480));
    };

    timeouts.push(setTimeout(revealNext, 300));

    return () => {
      clearAll();
      revealCleanupRef.current = null;
    };
  }, [dept?.id]);

  const skipHistory = () => {
    if (!dept || historyReady) return;
    revealCleanupRef.current?.();
    revealCleanupRef.current = null;
    setMessages(generateChatScript(dept.id));
    setHistoryReady(true);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!dept) {
    return (
      <div className="w-full h-screen flex items-center justify-center pa-bg-lobby">
        <div className="pa-panel p-8 text-center">
          <p className="pa-title text-xl mb-2">无法进入群聊</p>
          <p className="pa-subtitle text-sm">部门ID未找到: {selectedDept}</p>
          <button onClick={() => selectDepartment(null)} className="pa-btn pa-btn-pink mt-4 px-6 py-3">
            ← 返回
          </button>
        </div>
      </div>
    );
  }

  const deptNpcs = npcs.filter((n) => n.departmentId === dept.id);
  const quickReplies = QUICK_REPLIES[dept.id] || ['收到', '在做了', '马上好'];

  const moodBorders: Record<string, string> = {
    angry: '2px solid #ff6b6b',
    tired: '2px solid #c7ceea',
    normal: '2px solid #eee',
    energetic: '2px solid #a8e6cf',
    strict: '2px solid #ffe66d',
    sneaky: '2px solid #c7ceea',
    happy: '2px solid #a8e6cf',
    surprised: '2px solid #c7ceea',
  };

  const handleSend = (text: string) => {
    if (!historyReady) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: import('@/types').ChatMessage = {
      id: `user-${msgIdRef.current++}`,
      npcId: 'user',
      text: trimmed,
      timestamp: Date.now(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const responder = deptNpcs[Math.floor(Math.random() * deptNpcs.length)];
    if (responder) {
      const reply = getNPCReply(responder.id, trimmed);
      setMessages((prev) => [...prev, {
        id: `reply-${msgIdRef.current++}`,
        npcId: responder.id,
        text: reply.text,
        timestamp: Date.now(),
        mood: reply.mood,
      }]);
    }

    addNotification({ id: `n-${Date.now()}`, type: 'social', title: `${dept.name}群聊`, message: `你在${dept.name}发了一条消息`, timestamp: Date.now(), read: false });
  };

  const handleReaction = (msgId: string, reaction: string) => {
    setReactions((prev) => ({ ...prev, [msgId]: [...(prev[msgId] || []), reaction] }));
    setShowReactionPicker(null);
  };

  const reactionIcons = ['👍', '😂', '🔥', '💀', '🎉', '❤️'];

  return (
    <div className="w-full h-screen flex flex-col pa-bg-lobby">
      <div className="pa-hud px-4 py-3 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => selectDepartment(null)} className="pa-icon-btn w-10 h-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pa-orange)" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <p className="pa-title text-base">💬 {dept.name}探路群</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="pa-progress-track w-16 h-2">
                <div className="pa-progress-fill" style={{ width: `${dept.chaosLevel}%` }} />
              </div>
              <span className="pa-subtitle text-[10px]">忙碌 {dept.chaosLevel}%</span>
              {!historyReady && (
                <button type="button" onClick={skipHistory} className="text-[10px] font-bold underline ml-1" style={{ color: dept.color }}>
                  跳过
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {deptNpcs.slice(0, 3).map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <FluffyAvatar mode="photo" src={n.avatar} size={38} borderColor={dept.color} onClick={() => setSelectedNPC(n.id)} />
            </motion.div>
          ))}
          <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDrawer(true)} className="pa-icon-btn w-10 h-10 ml-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pa-orange)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 pt-2 shrink-0">
        <button
          type="button"
          onClick={() => setTryWork(true)}
          className="w-full py-2.5 px-3 text-left pa-panel text-[11px] font-bold"
          style={{ borderColor: dept.color }}
        >
          🎭 零基础？点这里「干一天」—— 带黑话讲解和适岗判断
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const npc = npcs.find((n) => n.id === msg.npcId);
          const isUser = msg.isUser;
          const msgReactions = reactions[msg.id] || [];

          if (isUser) {
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end group">
                <div className="max-w-[80%] relative">
                  <div className="px-4 py-2.5 text-sm pa-bubble-user">
                    {msg.text}
                  </div>
                  {msgReactions.length > 0 && (
                    <div className="flex gap-1 mt-1 justify-end">
                      {msgReactions.map((r, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>{r}</span>)}
                    </div>
                  )}
                  <button onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <span className="text-xs">😊</span>
                  </button>
                  <AnimatePresence>
                    {showReactionPicker === msg.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -right-2 bottom-full mb-1 flex gap-1 px-2 py-1.5 rounded-full shadow-lg z-10" style={{ backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                        {reactionIcons.map((r) => <button key={r} onClick={() => handleReaction(msg.id, r)} className="text-base hover:scale-125 transition-transform">{r}</button>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 group">
              <FluffyAvatar mode="photo" src={npc?.avatar || defaultAvatar} size={42} borderColor={dept.color} onClick={() => setSelectedNPC(msg.npcId)} />
              <div className="max-w-[75%] relative">
                <p className="text-[10px] font-bold mb-0.5" style={{ color: '#aaa' }}>{npc?.name} 🐾</p>
                <div className="px-4 py-2.5 text-sm pa-bubble-npc relative" style={{ border: moodBorders[msg.mood || 'normal'] || '2px solid var(--pa-paper-dark)' }}>
                  {msg.text}
                </div>
                {msgReactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {msgReactions.map((r, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>{r}</span>)}
                  </div>
                )}
                <button onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)} className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <span className="text-xs">😊</span>
                </button>
                <AnimatePresence>
                  {showReactionPicker === msg.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -right-2 bottom-full mb-1 flex gap-1 px-2 py-1.5 rounded-full shadow-lg z-10" style={{ backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                      {reactionIcons.map((r) => <button key={r} onClick={() => handleReaction(msg.id, r)} className="text-base hover:scale-125 transition-transform">{r}</button>)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

      </div>

      {/* Quick Replies */}
      <div className={`px-4 py-2 shrink-0 pa-hud border-t-0 transition-opacity ${historyReady ? '' : 'opacity-40 pointer-events-none'}`} style={{ borderRadius: 0 }}>
        <p className="pa-subtitle text-[10px] px-1 mb-1">{historyReady ? '💬 快捷回复' : '💬 历史消息加载中…'}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickReplies.slice(0, 5).map((reply, i) => (
            <motion.button
              key={reply}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend(reply)}
              className="pa-tag whitespace-nowrap shrink-0 px-4 py-2 text-xs pa-btn-height"
            >
              {reply}
            </motion.button>
          ))}
        </div>
      </div>

      <div className={`px-4 py-3 flex items-center gap-2 shrink-0 pa-panel mx-3 mb-3 transition-opacity ${historyReady ? '' : 'opacity-40'}`} style={{ borderRadius: 'var(--pa-radius-lg)' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && historyReady && handleSend(inputText)}
          disabled={!historyReady}
          placeholder={historyReady ? `问问${dept.name}的前辈们，这行到底干啥...` : '群消息还在往上翻…'}
          className="flex-1 h-11 px-4 text-sm font-bold outline-none pa-input disabled:cursor-not-allowed"
        />
        <motion.button
          type="button"
          whileTap={{ scale: historyReady ? 0.92 : 1 }}
          onClick={() => handleSend(inputText)}
          disabled={!historyReady}
          aria-label="发送"
          className="pa-icon-btn w-11 h-11 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderColor: dept.color }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dept.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9l20-7z" />
          </svg>
        </motion.button>
      </div>

      {/* Right Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-72 z-50 flex flex-col pa-panel" style={{ borderRadius: 'var(--pa-radius-lg) 0 0 var(--pa-radius-lg)' }}>
            <div className="px-4 py-3 border-b-2 flex items-center justify-between" style={{ borderColor: 'var(--pa-brown-light)' }}>
              <p className="pa-title text-sm">{dept.name}任务板 🎯</p>
              <button type="button" onClick={() => setShowDrawer(false)} className="pa-icon-btn w-9 h-9">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b9d" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-xs font-extrabold mb-1" style={{ color: '#333' }}>部门职责</p>
                <p className="text-xs" style={{ color: '#888' }}>{dept.description}</p>
              </div>
              <div>
                <p className="text-xs font-extrabold mb-1" style={{ color: '#333' }}>核心特征</p>
                <div className="flex flex-wrap gap-1">
                  {dept.features.map((f) => <span key={f} className="px-2.5 py-1 text-[10px] font-bold rounded-full" style={{ backgroundColor: dept.color + '15', color: dept.color }}>{f}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold mb-1" style={{ color: '#333' }}>🐾 小伙伴 · 点击私聊</p>
                <div className="space-y-2">
                  {deptNpcs.map((npc) => (
                    <button key={npc.id} type="button" onClick={() => setSelectedNPC(npc.id)} className="w-full flex items-center gap-2.5 p-2 text-left pa-btn pa-btn-cream h-auto min-h-0 justify-start">
                      <FluffyAvatar mode="photo" src={npc.avatar} size={36} borderColor={dept.color} />
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#333' }}>{npc.name}</p>
                        <p className="text-[9px] font-bold" style={{ color: '#888' }}>{npc.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold mb-1" style={{ color: '#333' }}>待办/已完成</p>
                <div className="space-y-1">
                  {dept.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 py-1">
                      <span className="text-sm">{task.status === 'done' ? '✅' : '🎯'}</span>
                      <span className="text-xs font-bold" style={{ color: task.status === 'done' ? '#888' : '#333', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{selectedNPC && <PrivateChat npcId={selectedNPC} onClose={() => setSelectedNPC(null)} />}</AnimatePresence>
      <AnimatePresence>{showBadge && <CyberBadge />}</AnimatePresence>
      <AnimatePresence>
        {tryWork && getWorkMoment(dept.id) && (
          <WorkMomentModal moment={getWorkMoment(dept.id)!} color={dept.color} onClose={() => setTryWork(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
