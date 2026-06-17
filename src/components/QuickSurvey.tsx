import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { surveyQuestions, titleMap, tagPresets } from '@/data/surveyData';
import PABackground from '@/components/pa/PABackground';
import FluffyAvatar from '@/components/FluffyAvatar';
import { defaultAvatar } from '@/data/partyAnimalsAssets';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'.split('');

const QUESTION_VIBES = [
  { stamp: '测', line: '别装了，你根本没作息', tilt: -12 },
  { stamp: '啊这', line: '大脑开机检查中……', tilt: -8 },
  { stamp: '怼', line: '最后一问，憋不住了？', tilt: -14 },
] as const;

function scrambleText(text: string, duration: number, onDone: (t: string) => void) {
  const target = text;
  let frame = 0;
  const totalFrames = Math.floor(duration * 60);
  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    let result = '';
    for (let i = 0; i < target.length; i++) {
      if (i < Math.floor(progress * target.length)) result += target[i];
      else result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    onDone(result);
    if (frame >= totalFrames) {
      clearInterval(interval);
      onDone(target);
    }
  }, 1000 / 60);
}

export default function QuickSurvey() {
  const setPhase = useGameStore((s) => s.setPhase);
  const setUser = useGameStore((s) => s.setUser);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayTags, setDisplayTags] = useState<string[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    if (currentQ < surveyQuestions.length - 1) setCurrentQ(currentQ + 1);
    else setShowBadge(true);
  };

  useEffect(() => {
    if (!showBadge) return;
    const key = answers.join('+');
    const title = titleMap[key] || '神秘职业动物';
    const tags = [
      tagPresets[Math.floor(Math.random() * tagPresets.length)],
      tagPresets[Math.floor(Math.random() * tagPresets.length)],
    ];

    scrambleText('新人_' + Math.floor(Math.random() * 10000), 0.8, setDisplayName);
    setTimeout(() => scrambleText(title, 1.0, setDisplayTitle), 900);
    setTimeout(() => setDisplayTags(tags), 2000);

    const timer3 = setTimeout(() => {
      setUser({
        name: '新人_' + Math.floor(Math.random() * 10000),
        avatar: defaultAvatar,
        title,
        tags,
        bio: '职业探索者 · 正在用画像匹配适合自己的行业与职级路径',
        likes: 0,
        isVip: false,
        traits: answers,
      });
      setPhase('sandbox');
    }, 3200);

    return () => clearTimeout(timer3);
  }, [showBadge, answers, setUser, setPhase]);

  if (showBadge) {
    return (
      <PABackground variant="warm" className="flex items-center justify-center">
        <motion.div
          ref={badgeRef}
          initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180 }}
          className="pa-panel pa-panel-accent relative w-80 p-6 sm:p-8 z-10"
        >
          <div className="text-center text-5xl mb-3">🎫</div>
          <div className="flex items-center gap-4 mb-4">
            <FluffyAvatar src={defaultAvatar} size={64} showExpression={false} />
            <div>
              <p className="pa-title text-sm">{displayName}</p>
              <span className="pa-tag mt-1 inline-block">{displayTitle}</span>
            </div>
          </div>
          <div className="pa-progress-track h-2 mb-4">
            <motion.div className="pa-progress-fill" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.2 }} />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {displayTags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="pa-tag-pink text-xs px-3 py-1"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <p className="pa-subtitle text-xs text-center">🐾 正在生成你的职业匹配档案...</p>
        </motion.div>
      </PABackground>
    );
  }

  const q = surveyQuestions[currentQ];

  return (
    <PABackground variant="sky">
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pa-content-layer">
        <div className="w-full max-w-sm mb-10">
          <div className="flex gap-1.5 mb-3">
            {surveyQuestions.map((_, i) => (
              <div
                key={i}
                className="pa-step-dot"
                style={{
                  backgroundColor: i <= currentQ ? 'var(--pa-orange)' : 'var(--pa-paper-dark)',
                  opacity: i <= currentQ ? 1 : 0.45,
                  transform: i === currentQ ? 'scaleY(1.35)' : 'scaleY(1)',
                }}
              />
            ))}
          </div>
          <p className="pa-label">灵魂拷问 {currentQ + 1} / {surveyQuestions.length}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <div className="pa-panel pa-panel-accent p-6 sm:p-8 mb-6 text-center relative overflow-hidden">
              <motion.span
                key={`${currentQ}-stamp`}
                initial={{ scale: 0, rotate: QUESTION_VIBES[currentQ].tilt - 18, y: -8 }}
                animate={{
                  scale: 1,
                  rotate: [QUESTION_VIBES[currentQ].tilt, QUESTION_VIBES[currentQ].tilt + 3, QUESTION_VIBES[currentQ].tilt - 2, QUESTION_VIBES[currentQ].tilt],
                  y: [0, -2, 0],
                }}
                transition={{
                  scale: { type: 'spring', stiffness: 520, damping: 13 },
                  rotate: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
                  y: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
                }}
                className="pa-stamp absolute top-3 right-3"
              >
                {QUESTION_VIBES[currentQ].stamp}
              </motion.span>
              <motion.p
                key={`${currentQ}-line`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-extrabold mb-2 tracking-wide"
                style={{ color: 'var(--pa-pink-dark)' }}
              >
                {QUESTION_VIBES[currentQ].line}
              </motion.p>
              <motion.h2
                key={q.id}
                initial={{ opacity: 0, rotate: -2 }}
                animate={{ opacity: 1, rotate: [0, 1.2, -1, 0.6, 0] }}
                transition={{
                  opacity: { duration: 0.25 },
                  rotate: { delay: 0.15, duration: 0.55, ease: 'easeOut' },
                }}
                className="pa-title text-lg sm:text-xl leading-snug"
              >
                {q.question}
              </motion.h2>
            </div>
            <div className="space-y-2.5">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  type="button"
                  initial={{ opacity: 0, x:12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(q.traits[i])}
                  className="w-full py-3.5 px-5 text-sm pa-btn pa-btn-cream text-left pa-btn-height"
                >
                  <span className="mr-2 opacity-60 font-semibold">{i === 0 ? 'A' : 'B'}</span>
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PABackground>
  );
}
