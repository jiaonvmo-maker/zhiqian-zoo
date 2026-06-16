import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import PABackground from '@/components/pa/PABackground';
import FluffyAvatar from '@/components/FluffyAvatar';
import { entryShowcase } from '@/data/partyAnimalsAssets';

const LABELS = ['先逛大厦', '做匹配测评', '问过来人', '查薪资数据', '跟风热门', '再观望下'];
const FIRE_TEXTS = ['赛道信号不匹配，建议重测', '这个方向和你的画像偏差较大', '志愿填早了——刷新重来'];
const BLAME_TEXTS = ['听亲戚的？信息源要更新', '室友说好 ≠ 适合你', '种草帖看看就好，别当真'];
const SUCCESS_TEXTS = ['画像采集启动，进入测评', '匹配引擎就绪，开始画像', '路径解锁，进入职业测评'];

function initButtons() {
  const shuffled = [...LABELS].sort(() => Math.random() - 0.5).slice(0, 3);
  const results: ('success' | 'fire' | 'blame')[] = ['fire', 'blame', 'success'];
  const finalBtns = shuffled.map((label, i) => ({ id: i, label, result: results[i] }));
  return finalBtns.sort(() => Math.random() - 0.5);
}

export default function EntryGame() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [buttons, setButtons] = useState<{ id: number; label: string; result: 'success' | 'fire' | 'blame' }[]>([]);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [finalText, setFinalText] = useState('');
  const [hiddenClicked, setHiddenClicked] = useState(false);
  const [showShake, setShowShake] = useState(false);

  useEffect(() => {
    setButtons(initButtons());
  }, []);

  const handleClick = useCallback((id: number, result: 'success' | 'fire' | 'blame') => {
    if (clickedId !== null) return;
    setClickedId(id);

    if (result === 'fire') {
      setFinalText(FIRE_TEXTS[Math.floor(Math.random() * FIRE_TEXTS.length)]);
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);
    } else if (result === 'blame') {
      setFinalText(BLAME_TEXTS[Math.floor(Math.random() * BLAME_TEXTS.length)]);
    } else {
      setFinalText(SUCCESS_TEXTS[Math.floor(Math.random() * SUCCESS_TEXTS.length)]);
      setTimeout(() => setPhase('survey'), 1400);
    }
  }, [clickedId, setPhase]);

  const handleHiddenClick = useCallback(() => {
    setHiddenClicked(true);
    setTimeout(() => setPhase('survey'), 800);
  }, [setPhase]);

  return (
    <PABackground variant="sky">
      <AnimatePresence>
        {showShake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center pa-overlay"
          >
            <motion.div animate={{ x: [-8, 8, -8, 8, 0] }} transition={{ duration: 0.4 }}>
              <span className="text-6xl">💥</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-12"
      >
        <motion.div
          className="pa-hero-card px-8 py-8 mb-10 text-center max-w-md w-full"
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
        >
          <div className="text-5xl mb-4 inline-block">🐾</div>
          <p className="pa-label mb-2">Career Safari</p>
          <h1 className="pa-title text-3xl sm:text-4xl tracking-tight">不要拍打玻璃</h1>
          <p className="pa-subtitle text-sm sm:text-base mt-3 max-w-xs mx-auto">
            啊 伟大的幻觉
          </p>
        </motion.div>

        <div className="flex gap-4 sm:gap-6 mb-10 items-end">
          {entryShowcase.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: 'spring', damping: 18, stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.08 }}
            >
              <FluffyAvatar src={item.src} size={64} mood="happy" showExpression borderColor="var(--pa-gold)" />
              <span className="pa-label text-[10px]">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-sm space-y-3">
          {buttons.map((btn, i) => {
            const done = clickedId === btn.id;
            const btnClass =
              done && btn.result === 'success'
                ? 'pa-btn pa-btn-green'
                : done && btn.result === 'fire'
                  ? 'pa-btn'
                  : 'pa-btn pa-btn-cream';

            return (
              <motion.button
                key={btn.id}
                type="button"
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={!clickedId ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick(btn.id, btn.result)}
                disabled={clickedId !== null}
                className={`w-full h-13 py-3.5 px-5 text-sm ${btnClass} pa-btn-height`}
              >
                <span className="flex items-center justify-center gap-2">
                  {done && <span>{btn.result === 'success' ? '🎊' : btn.result === 'fire' ? '💔' : '🏚️'}</span>}
                  {done ? finalText : btn.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {clickedId !== null && buttons[clickedId]?.result !== 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pa-subtitle text-xs"
            >
              路线不对，重新探索 🔄
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: hiddenClicked ? 1 : 0.35 }}
        whileHover={{ opacity: 0.95, scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleHiddenClick}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-12 h-12 pa-btn pa-btn-pink rounded-full flex items-center justify-center text-lg shadow-lg"
        aria-label="彩蛋"
      >
        {hiddenClicked ? '👑' : '🐾'}
      </motion.button>
      {hiddenClicked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pa-tag text-sm px-4 py-2"
        >
          👑 直觉通道 · 跳过测评直接闯！
        </motion.div>
      )}
    </PABackground>
  );
}
