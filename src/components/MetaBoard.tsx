import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { defaultAvatar } from '@/data/partyAnimalsAssets';
import CyberBadge from './CyberBadge';
import FluffyAvatar from './FluffyAvatar';
import PAHeader from '@/components/pa/PAHeader';
import { Heart, Bookmark, Plus, X, TrendingUp, AlertTriangle, CheckCircle, Skull } from 'lucide-react';

export default function MetaBoard() {
  const { metaIdeas, likeIdea, addMetaIdea, showBadge, setPhase, addNotification } = useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    if (likedSet.has(id)) return;
    likeIdea(id);
    setLikedSet((prev) => new Set(prev).add(id));
  };

  const handleSubmit = () => {
    if (!newTitle.trim()) return;
    const idea = {
      id: `idea-${Date.now()}`,
      userName: '匿名探索者',
      userAvatar: defaultAvatar,
      title: newTitle,
      description: newDesc,
      likes: 1,
      bookmarks: 0,
      status: 'voting' as const,
      progress: 0,
      timestamp: Date.now(),
    };
    addMetaIdea(idea);
    addNotification({
      id: `n-${Date.now()}`,
      type: 'project',
      title: '需求已提交',
      message: `你提交了「${newTitle}」，等待投票`,
      timestamp: Date.now(),
      read: false,
    });
    setNewTitle('');
    setNewDesc('');
    setShowForm(false);
  };

  const voting = metaIdeas.filter((i) => i.status === 'voting');
  const dev = metaIdeas.filter((i) => i.status === 'dev');
  const done = metaIdeas.filter((i) => i.status === 'done');
  const dead = metaIdeas.filter((i) => i.status === 'dead');

  const renderIdea = (idea: (typeof metaIdeas)[0], highlight?: boolean) => {
    const isLiked = likedSet.has(idea.id);
    const statusStyle = {
      voting: { border: 'var(--pa-brown-light)', bar: 'var(--pa-orange)' },
      dev: { border: 'var(--pa-orange)', bar: 'var(--pa-gold)' },
      done: { border: 'var(--pa-green)', bar: 'var(--pa-green)' },
      dead: { border: '#c93d3d', bar: '#c93d3d' },
    };
    const sc = statusStyle[idea.status];

    return (
      <motion.div
        key={idea.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full p-4 pa-panel ${highlight ? 'pa-panel-accent' : ''}`}
        style={{
          borderColor: idea.likes > 100 ? 'var(--pa-gold)' : sc.border,
          opacity: idea.status === 'dead' ? 0.85 : 1,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <FluffyAvatar src={idea.userAvatar} size={36} mood="chill" showExpression borderColor="var(--pa-gold)" />
          <span className="pa-subtitle text-xs">{idea.userName}</span>
          {idea.status === 'done' && <CheckCircle size={14} style={{ color: 'var(--pa-green)' }} />}
          {idea.status === 'dead' && <Skull size={14} style={{ color: '#c93d3d' }} />}
        </div>

        <h3
          className="pa-title text-sm mb-1"
          style={{
            color: idea.status === 'dead' ? 'var(--pa-brown)' : 'var(--pa-dark)',
            textDecoration: idea.status === 'dead' ? 'line-through' : 'none',
          }}
        >
          {idea.title}
        </h3>
        <p className="pa-subtitle text-xs mb-3">{idea.description}</p>

        {idea.status !== 'voting' && (
          <div className="mb-3">
            <div className="pa-progress-track h-2">
              <motion.div
                className="pa-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${idea.progress}%` }}
                transition={{ duration: 1 }}
                style={{ background: sc.bar }}
              />
            </div>
            <p className="pa-subtitle text-[10px] mt-1">
              {idea.status === 'dev' && '开发中'}
              {idea.status === 'done' && '已完成'}
              {idea.status === 'dead' && '已破产'}
              {' · '}
              {idea.progress}%
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleLike(idea.id)}
            className="flex items-center gap-1 text-xs font-bold"
            style={{ color: isLiked ? 'var(--pa-green)' : 'var(--pa-brown)' }}
          >
            <Heart size={14} fill={isLiked ? 'var(--pa-green)' : 'none'} />
            <span className="relative">{idea.likes}
              <AnimatePresence>
                {isLiked && (
                  <motion.span
                    key="fly"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -24 }}
                    className="absolute left-1/2 -translate-x-1/2 font-bold"
                    style={{ color: 'var(--pa-green)' }}
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>
          <button type="button" className="flex items-center gap-1 text-xs font-bold pa-subtitle">
            <Bookmark size={14} />
            {idea.bookmarks}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen pa-bg-lobby relative">
      <PAHeader
        onBack={() => setPhase('sandbox')}
        icon="🎯"
        title="职业灵感墙"
        subtitle="大家都在测什么 · 许愿你想探索的方向"
        right={
          <button type="button" onClick={() => setShowForm(true)} className="pa-btn pa-btn-pink w-10 h-10 min-w-[40px] p-0">
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4 pt-20 space-y-6 overflow-y-auto max-h-screen pb-8">
               <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: 'var(--pa-orange)' }} />
            <p className="pa-title text-sm">许愿区 · 你想测什么职业</p>
          </div>
          <div className="space-y-3">
            {voting.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {renderIdea(idea, idea.likes > 50)}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <p className="pa-title text-sm mb-3">🎮 探索进度 · 社区共建</p>
          {dev.length > 0 && (
            <div className="space-y-3 mb-3">
              {dev.map((idea, i) => (
                <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  {renderIdea(idea)}
                </motion.div>
              ))}
            </div>
          )}
          {done.length > 0 && (
            <div className="space-y-3 mb-3">
              {done.map((idea, i) => (
                <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (dev.length + i) * 0.06 }}>
                  {renderIdea(idea)}
                </motion.div>
              ))}
            </div>
          )}
          {dead.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 px-2">
                <AlertTriangle size={14} style={{ color: '#c93d3d' }} />
                <p className="text-[10px] font-bold" style={{ color: '#c93d3d' }}>破产项目</p>
              </div>
              {dead.map((idea, i) => (
                <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (dev.length + done.length + i) * 0.06 }}>
                  {renderIdea(idea)}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ backgroundColor: 'rgba(34, 34, 34, 0.45)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full max-w-md p-5 sm:p-6 pa-panel pa-panel-accent"
              style={{ borderRadius: 'var(--pa-radius-lg) var(--pa-radius-lg) 0 0' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="pa-title text-sm">提交新想法 🐾</p>
                <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowForm(false)} className="pa-icon-btn w-9 h-9">
                  <X size={16} style={{ color: 'var(--pa-orange)' }} />
                </motion.button>
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="想法标题（如：文科生能干嘛大全）"
                className="w-full h-11 px-4 text-sm font-bold outline-none mb-3 pa-input"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="描述你想探索的职业方向或测评想法..."
                rows={3}
                className="w-full px-4 py-2 text-sm font-bold outline-none mb-4 resize-none pa-input"
                style={{ height: 'auto', borderRadius: 'var(--pa-radius-md)' }}
              />
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="w-full h-12 pa-btn pa-btn-pink text-sm pa-btn-height">
                丢进投票池 🎉
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showBadge && <CyberBadge />}</AnimatePresence>
    </div>
  );
}
