import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { npcs } from '@/data/npcs';
import { useGameStore } from '@/store/gameStore';
import { Heart, X, ArrowRight } from 'lucide-react';
import { TierBadge } from '@/components/CareerLadder';
import FluffyAvatar from '@/components/FluffyAvatar';
import { AnalyticsEvents, track } from '@/analytics';

interface ChatEntry {
  id: string;
  isUser: boolean;
  text: string;
  mood?: 'happy' | 'angry' | 'neutral' | 'surprised';
  options?: string[];
}

const PRIVATE_SCENARIOS: Record<string, { intro: string; choices: { text: string; response: string; mood: 'happy' | 'angry' | 'neutral' | 'surprised'; favor: number }[] }[]> = {
  'pm-1': [
    {
      intro: '王产品正在盯着JIRA看板发呆，看到你过来抬了抬眼镜。',
      choices: [
        { text: '请喝奶茶', response: '（接过奶茶）算你有良心，这个需求我帮你压一压排期。', mood: 'happy', favor: 15 },
        { text: '甩锅说这是特性', response: '特性？！用户能忍受这种特性？重新评估！', mood: 'angry', favor: -10 },
        { text: '说测试提的Bug', response: '测试又找事了？算了，我帮你挡一下，但下不为例。', mood: 'neutral', favor: 5 },
      ],
    },
    {
      intro: '王产品突然转头问你："下周能上线吗？"',
      choices: [
        { text: '肯定能，我加班搞', response: '好！我就喜欢你这种态度！（拍了拍你的肩）', mood: 'happy', favor: 20 },
        { text: '看排期，可能要延后', response: '延后？老板那边我怎么交代？你行你上！', mood: 'angry', favor: -15 },
        { text: '先出个MVP试试？', response: '嗯...MVP思路不错，你先出个方案我看看。', mood: 'neutral', favor: 10 },
      ],
    },
  ],
  'dev-1': [
    {
      intro: '张程序正在敲代码，屏幕上一片红色报错。',
      choices: [
        { text: '帮他排查Bug', response: '谢了兄弟，这个问题我搞了两小时了...原来是这里！', mood: 'happy', favor: 20 },
        { text: '说这不是Bug是特性', response: '（叹气）你们产品都是这么说的，习惯了。', mood: 'neutral', favor: 0 },
        { text: '问他要多久修好', response: '在写了在写了（新建文件夹.jpg），你别催了。', mood: 'angry', favor: -5 },
      ],
    },
    {
      intro: '张程序摘下眼镜揉了揉眼睛，看起来很疲惫。',
      choices: [
        { text: '请他喝咖啡提神', response: '（精神一振）你是我今天遇到的唯一好人。', mood: 'happy', favor: 15 },
        { text: '问他加班到几点', response: '凌晨吧...可能通宵。你问这个干嘛？', mood: 'neutral', favor: 0 },
        { text: '说他代码写得好', response: '（愣了一下）你是第一个夸我的...谢谢。', mood: 'surprised', favor: 25 },
      ],
    },
  ],
  'qa-1': [
    {
      intro: '赵测试正拿着Bug清单，脸色不太好看。',
      choices: [
        { text: '承认是Bug马上修', response: '（点头）算你态度好，这个优先级我给你标P0。', mood: 'happy', favor: 15 },
        { text: '说这是环境问题', response: '环境问题？我三个浏览器都复现了！你再说一遍？', mood: 'angry', favor: -20 },
        { text: '请他吃零食消消气', response: '（接过零食）...算了，这个我先给你记低优。', mood: 'neutral', favor: 5 },
      ],
    },
    {
      intro: '赵测试突然问你："这个场景你测了吗？"',
      choices: [
        { text: '说测了，没问题', response: '真的？那我再跟一轮回归，别骗我。', mood: 'neutral', favor: 0 },
        { text: '说没测，你帮我测吧', response: '（翻白眼）我测？我测了100个了！你自己来！', mood: 'angry', favor: -10 },
        { text: '说你是我的守护神', response: '（脸红了）...少油嘴滑舌，好好写代码。', mood: 'surprised', favor: 20 },
      ],
    },
  ],
  'dev-2': [
    {
      intro: '刘全栈趴在桌上，看起来已经放弃了人生。',
      choices: [
        { text: '请他吃饭', response: '（抬头）饭？什么饭？...走吧，我需要逃离这工位。', mood: 'happy', favor: 20 },
        { text: '问他是不是又要离职', response: '（苦笑）你怎么知道的？简历都写好了。', mood: 'neutral', favor: 0 },
        { text: '说老板又要加需求', response: '（拍桌）还让不让人活了？！我这就去提离职！', mood: 'angry', favor: -15 },
      ],
    },
  ],
  'design-1': [
    {
      intro: '林设计正对着屏幕比对像素，嘴里念念有词。',
      choices: [
        { text: '说设计很好看', response: '（愣住）...真的？我做了8稿，终于有人懂了。', mood: 'surprised', favor: 25 },
        { text: '说能再改一版吗', response: '（摔笔）改？！你知道8稿是什么概念吗？！', mood: 'angry', favor: -20 },
        { text: '问他参考了哪些设计', response: '（眼睛亮了）我跟你讲，dribbble上有个作品...', mood: 'happy', favor: 15 },
      ],
    },
  ],
  'hr-1': [
    {
      intro: '孙人事拿着文件夹，目光在你身上打量。',
      choices: [
        { text: '问她绩效怎么评', response: '（翻文件）嗯...你绩效嘛...先说说你做了什么？', mood: 'neutral', favor: 0 },
        { text: '说团建能不能不去', response: '（脸色一变）不去？这是强制性的，算旷工。', mood: 'angry', favor: -15 },
        { text: '夸她今天气色好', response: '（笑了一下）油嘴滑舌...下不为例，给你批假。', mood: 'happy', favor: 20 },
      ],
    },
  ],
  'ceo-1': [
    {
      intro: '马老板站在落地窗前，背对着你。',
      choices: [
        { text: '说公司战略太对了', response: '（转身）年轻人有眼光！跟着我，明年上市有你一份！', mood: 'happy', favor: 30 },
        { text: '问什么时候涨薪', response: '（沉默3秒）...等公司盈利吧，先奋斗。', mood: 'neutral', favor: -5 },
        { text: '说隔壁公司挖我', response: '（转身瞪着你）...给你加20%，不许走。', mood: 'surprised', favor: 25 },
      ],
    },
  ],
};

const DEFAULT_SCENARIO = {
  intro: 'TA正在忙工作，看到你过来停下了手中的事。',
  choices: [
    { text: '打招呼', response: '嗯，有事吗？', mood: 'neutral' as const, favor: 0 },
    { text: '请喝咖啡', response: '谢谢，正好需要提提神。', mood: 'happy' as const, favor: 10 },
    { text: '请教问题', response: '说吧，我看看能不能帮上忙。', mood: 'neutral' as const, favor: 5 },
  ],
};

export default function PrivateChat({ npcId, onClose }: { npcId: string; onClose: () => void }) {
  const npc = npcs.find((n) => n.id === npcId);
  const { addNotification } = useGameStore();
  const [favor, setFavor] = useState(50);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [showOptions, setShowOptions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scenarios = PRIVATE_SCENARIOS[npcId] || [DEFAULT_SCENARIO];
  const currentScenario = scenarios[scenarioIdx % scenarios.length];

  // Initialize entries based on the current scenario - reset when scenario changes
  const initialEntries = useMemo(() => {
    if (!npc) return [];
    return [{ id: 'intro', isUser: false, text: currentScenario.intro, mood: 'neutral' as const }];
  }, [npc, currentScenario.intro]);

  const [entries, setEntries] = useState<ChatEntry[]>(initialEntries);

  // Reset entries when scenario changes
  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  useEffect(() => {
    if (!npc) return;
    track(AnalyticsEvents.PRIVATE_CHAT_OPEN, {
      npc_id: npcId,
      dept_id: npc.departmentId,
      tier: npc.tier,
    });
  }, [npc, npcId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

  const handleChoice = (choice: (typeof currentScenario.choices)[0]) => {
    setShowOptions(false);
    setEntries((prev) => [...prev, { id: `user-${Date.now()}`, isUser: true, text: choice.text }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setEntries((prev) => [...prev, { id: `npc-${Date.now()}`, isUser: false, text: choice.response, mood: choice.mood }]);
      if (choice.favor) setFavor((prev) => Math.min(100, Math.max(0, prev + choice.favor)));
      setTimeout(() => {
        if (scenarioIdx < scenarios.length - 1) {
          setScenarioIdx((prev) => prev + 1);
          setShowOptions(true);
        } else {
          const finalFavor = Math.min(100, Math.max(0, favor + (choice.favor || 0)));
          track(AnalyticsEvents.PRIVATE_CHAT_COMPLETE, {
            npc_id: npcId,
            dept_id: npc?.departmentId ?? '',
            scenarios_done: scenarios.length,
            final_favor: finalFavor,
          });
          setEntries((prev) => [
            ...prev,
            {
              id: `summary-${Date.now()}`,
              isUser: false,
              text: favor > 60 ? '（你们相谈甚欢，关系更好了）' : favor < 40 ? '（气氛尴尬，关系恶化）' : '（对话结束，关系平平）',
              mood: 'neutral',
            },
          ]);
          setShowOptions(true);
          addNotification({
            id: `n-${Date.now()}`,
            type: 'social',
            title: '私聊结束',
            message: `你与${npc?.name}的私聊结束，好感度${favor}%`,
            timestamp: Date.now(),
            read: false,
            actorAvatar: npc?.avatar,
          });
        }
      }, 1000);
    }, 600);
  };

  if (!npc) return null;

  const favorLabel = favor >= 80 ? '挚友' : favor >= 60 ? '友好' : favor >= 40 ? '一般' : favor >= 20 ? '冷淡' : '敌对';
  const favorColor = favor >= 60 ? 'var(--pa-green)' : favor >= 40 ? 'var(--pa-gold)' : 'var(--pa-pink)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(34, 34, 34, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="w-full max-w-md h-[82vh] flex flex-col pa-panel pa-panel-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b-2 flex items-center justify-between" style={{ borderColor: 'var(--pa-brown-light)' }}>
          <div className="flex items-center gap-3">
            <FluffyAvatar src={npc.avatar} size={48} mood={npc.personality} showExpression borderColor="var(--pa-gold)" />
            <div className="min-w-0">
              <p className="pa-title text-sm">{npc.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="pa-subtitle text-[10px]">{npc.role}</p>
                <TierBadge label={npc.tierLabel} color="var(--pa-orange)" />
              </div>
              <p className="text-[9px] mt-1 leading-snug" style={{ color: '#888' }}>{npc.dailyBrief}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-0.5">
                <Heart size={11} style={{ color: favorColor }} />
                <span className="text-[10px] font-bold" style={{ color: favorColor }}>{favorLabel}</span>
              </div>
              <div className="pa-progress-track w-16 h-1.5">
                <div className="h-full rounded-full transition-all" style={{ width: `${favor}%`, background: favorColor }} />
              </div>
            </div>
            <button type="button" onClick={onClose} className="pa-icon-btn w-9 h-9">
              <X size={16} style={{ color: 'var(--pa-orange)' }} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {entries.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={entry.isUser ? 'flex justify-end' : 'flex gap-2'}>
              {!entry.isUser && <FluffyAvatar src={npc.avatar} size={36} mood={npc.personality} showExpression borderColor="var(--pa-gold)" className="flex-shrink-0 mt-1" />}
              <div className={`max-w-[82%] ${entry.isUser ? '' : ''}`}>
                {!entry.isUser && <p className="pa-subtitle text-[9px] mb-0.5">{npc.name}</p>}
                <div className={`px-3 py-2 text-sm inline-block ${entry.isUser ? 'pa-bubble-user' : 'pa-bubble-npc'}`}>{entry.text}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <FluffyAvatar src={npc.avatar} size={36} mood={npc.personality} showExpression borderColor="var(--pa-gold)" />
              <div className="pa-bubble-npc px-3 py-2">
                <div className="flex gap-1">
                  {[0, 0.15, 0.3].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--pa-orange)', animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {showOptions && !isTyping && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 border-t-2 space-y-2" style={{ borderColor: 'var(--pa-brown-light)' }}>
            <p className="pa-subtitle text-[10px]">选择你的回应：</p>
            {currentScenario.choices.map((choice, i) => (
              <motion.button
                key={i}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice(choice)}
                className="w-full px-4 py-2.5 text-sm text-left pa-btn pa-btn-cream flex items-center justify-between h-auto min-h-[44px]"
              >
                <span>{choice.text}</span>
                <ArrowRight size={14} style={{ color: 'var(--pa-brown)' }} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
