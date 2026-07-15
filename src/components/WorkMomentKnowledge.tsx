import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Monitor, ChevronUp, Building2 } from 'lucide-react';
import type { TermItem, ToolItem, LearnLevel } from '@/data/workMomentTypes';
import { LEARN_LABELS, LEARN_COLORS } from '@/data/workMomentTypes';
import { companyContext, companyBrief, sprintOneLiner } from '@/data/companyContext';

type Tab = 'terms' | 'tools';

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 28 } },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
};

const panelBodyVariants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1, transition: { height: { duration: 0.28 }, opacity: { duration: 0.2, delay: 0.06 } } },
  exit: { height: 0, opacity: 0, transition: { height: { duration: 0.22 }, opacity: { duration: 0.12 } } },
};

function LearnBadge({ level }: { level: LearnLevel }) {
  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0"
      style={{ color: LEARN_COLORS[level], backgroundColor: LEARN_COLORS[level] + '18', border: `1px solid ${LEARN_COLORS[level]}44` }}
    >
      {LEARN_LABELS[level]}
    </motion.span>
  );
}

function ToolCard({ tool, color, compact, index = 0 }: { tool: ToolItem; color: string; compact?: boolean; index?: number }) {
  const rows = compact
    ? [{ label: '干啥', value: tool.today }]
    : [
        { label: '是什么', value: tool.what },
        { label: '谁在用', value: tool.who },
        { label: '今天干啥', value: tool.today },
        { label: '零基础', value: tool.learnTip },
      ];

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      layout
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: color + '44', backgroundColor: '#fff' }}
    >
      <div className="flex items-center gap-2 px-2.5 py-2 border-b" style={{ borderColor: color + '22', backgroundColor: color + '0c' }}>
        <motion.span
          className="text-base leading-none"
          initial={{ rotate: -8, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, delay: index * 0.05 }}
        >
          {tool.icon}
        </motion.span>
        <span className="text-[11px] font-extrabold flex-1" style={{ color: '#333' }}>{tool.name}</span>
        <LearnBadge level={tool.learn} />
      </div>
      <div className="px-2.5 py-2 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2 text-[10px] leading-snug">
            <span className="font-extrabold shrink-0 w-[3.2rem]" style={{ color: color + 'cc' }}>{r.label}</span>
            <span style={{ color: '#555' }}>{r.value}</span>
          </div>
        ))}
        {tool.alt && !compact && (
          <p className="text-[9px] pt-1 border-t" style={{ borderColor: '#eee', color: '#999' }}>
            国内常见替代：{tool.alt}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function TermRow({ term, color }: { term: TermItem; color: string }) {
  return (
    <motion.div
      variants={itemVariants}
      layout
      className="rounded-lg px-2.5 py-2 border"
      style={{ borderColor: color + '33', backgroundColor: '#fff' }}
    >
      <p className="text-[11px] font-extrabold mb-0.5" style={{ color }}>{term.term}</p>
      <p className="text-[10px] leading-snug" style={{ color: '#555' }}>{term.plain}</p>
      {term.chain && (
        <p className="text-[9px] mt-1 flex items-center gap-1" style={{ color: '#999' }}>
          <span className="font-bold" style={{ color: color + 'aa' }}>协作链</span>
          {term.chain}
        </p>
      )}
    </motion.div>
  );
}

/** 公司 + 当前迭代上下文 — 各部门 intro / 互动顶栏 */
export function CompanyContextBanner({ color, compact }: { color: string; compact?: boolean }) {
  const { companyName, productName, productDesc, currentSprint } = companyContext;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-xl border-2 overflow-hidden"
      style={{ borderColor: color + '55' }}
    >
      <div className="px-3 py-2 flex items-start gap-2" style={{ backgroundColor: color + '14' }}>
        <Building2 size={14} className="shrink-0 mt-0.5" style={{ color }} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold leading-snug" style={{ color: '#333' }}>
            {companyName} · {productName}
          </p>
          {!compact && (
            <p className="text-[9px] leading-snug mt-0.5" style={{ color: '#666' }}>{productDesc}</p>
          )}
        </div>
      </div>
      <div className="px-3 py-2 border-t" style={{ borderColor: color + '33', backgroundColor: '#fff' }}>
        <p className="text-[9px] font-extrabold mb-1" style={{ color }}>📌 本迭代需求</p>
        <p className="text-[10px] font-bold" style={{ color: '#444' }}>{currentSprint.name}</p>
        <p className="text-[9px] leading-snug mt-0.5" style={{ color: '#777' }}>{currentSprint.goal}</p>
        {!compact && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {currentSprint.pages.map((p) => (
              <span
                key={p}
                className="text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: color + '15', color }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** 互动中吸顶：术语 | 工具 分 Tab + 动效 */
export function StepKnowledgePanel({
  terms,
  tools,
  legacyJargon,
  color,
  showCompanyChip,
  defaultOpen = true,
}: {
  terms?: TermItem[];
  tools?: ToolItem[];
  legacyJargon?: { term: string; plain: string }[];
  color: string;
  showCompanyChip?: boolean;
  /** 有实景示意时默认收起，避免首屏把看板挤没 */
  defaultOpen?: boolean;
}) {
  const resolvedTerms: TermItem[] = terms?.length
    ? terms
    : (legacyJargon ?? []).map((j) => ({ term: j.term, plain: j.plain }));

  const hasTools = (tools?.length ?? 0) > 0;
  const [tab, setTab] = useState<Tab>('terms');
  const [open, setOpen] = useState(defaultOpen);
  const [showCollapseHint, setShowCollapseHint] = useState(defaultOpen);

  useEffect(() => {
    if (!open || !showCollapseHint) return;
    const timer = setTimeout(() => setShowCollapseHint(false), 3200);
    return () => clearTimeout(timer);
  }, [open, showCollapseHint]);

  const toggleOpen = () => {
    setOpen((prev) => {
      if (prev) setShowCollapseHint(false);
      else setShowCollapseHint(true);
      return !prev;
    });
  };

  if (!resolvedTerms.length && !hasTools) return null;

  return (
    <div className="sticky top-0 z-10 mx-1 mb-2 pt-0.5 pb-1" style={{ backgroundColor: 'var(--pa-paper)' }}>
      <motion.div
        layout
        className="rounded-xl overflow-hidden border-2 shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
        style={{ borderColor: color + '55', backgroundColor: '#fff' }}
      >
        <div className="flex items-center border-b" style={{ borderColor: color + '22', backgroundColor: color + '0a' }}>
          <button
            type="button"
            onClick={toggleOpen}
            className="flex-1 flex items-center justify-between px-3 py-2 text-left min-w-0"
          >
            <span className="text-[10px] font-extrabold flex items-center gap-1 truncate" style={{ color }}>
              <motion.span animate={{ rotate: open ? 0 : -12 }} transition={{ type: 'spring', stiffness: 300 }}>
                <BookOpen size={12} />
              </motion.span>
              零基础小抄
            </span>
            <span className="flex items-center gap-1 shrink-0 ml-2">
              <AnimatePresence>
                {open && showCollapseHint && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, x: 6 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.85], x: [6, 0, 0, -4] }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 2.6, times: [0, 0.12, 0.72, 1], ease: 'easeOut' }}
                    className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: color + '18', color }}
                  >
                    能收 ↑
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                animate={{
                  rotate: open ? 180 : 0,
                  y: open && showCollapseHint ? [0, -3, 0, -2, 0] : 0,
                  scale: open && showCollapseHint ? [1, 1.12, 1, 1.08, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 0.25 },
                  y: open && showCollapseHint
                    ? { repeat: 2, duration: 0.55, ease: 'easeInOut', repeatDelay: 0.35 }
                    : { duration: 0.2 },
                  scale: open && showCollapseHint
                    ? { repeat: 2, duration: 0.55, ease: 'easeInOut', repeatDelay: 0.35 }
                    : { duration: 0.2 },
                }}
              >
                <ChevronUp size={14} style={{ color }} />
              </motion.span>
            </span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              variants={panelBodyVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="overflow-hidden"
            >
              {showCompanyChip && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mx-2 mt-2 px-2 py-1 rounded-lg text-[9px] leading-snug"
                  style={{ backgroundColor: color + '10', color: '#666', borderLeft: `2px solid ${color}` }}
                >
                  🏢 {companyBrief()} · {sprintOneLiner()}
                </motion.p>
              )}

              {hasTools && (
                <div className="flex gap-1 px-2 pt-2 pb-1 relative">
                  {(['terms', 'tools'] as Tab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className="flex-1 py-1.5 text-[10px] font-extrabold rounded-lg relative z-10 transition-colors duration-200"
                      style={{
                        color: tab === t ? '#fff' : color,
                      }}
                    >
                      {tab === t && (
                        <motion.span
                          layoutId="knowledge-tab-pill"
                          className="absolute inset-0 rounded-lg -z-10"
                          style={{ backgroundColor: color }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      {t === 'terms' ? `📖 术语 ${resolvedTerms.length}` : `💻 工具 ${tools!.length}`}
                    </button>
                  ))}
                </div>
              )}

              <div className="px-2 pb-2 pt-1 max-h-[42vh] overflow-y-auto overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="space-y-1.5"
                  >
                    {tab === 'terms' && resolvedTerms.map((t) => (
                      <TermRow key={t.term} term={t} color={color} />
                    ))}
                    {tab === 'tools' && tools?.map((t, i) => (
                      <ToolCard key={t.name} tool={t} color={color} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/** 开场：今日工具预览 */
export function IntroToolsPanel({ tools, color }: { tools: ToolItem[]; color: string }) {
  if (!tools.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="pa-panel p-3"
      style={{ borderColor: color + '66' }}
    >
      <p className="text-[10px] font-extrabold mb-2 flex items-center gap-1" style={{ color }}>
        <Monitor size={12} /> 今天会碰到的软件
      </p>
      <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-2">
        {tools.map((t, i) => (
          <ToolCard key={t.name} tool={t} color={color} compact index={i} />
        ))}
      </motion.div>
      <p className="text-[9px] mt-2 text-center" style={{ color: '#999' }}>
        互动过程中可随时切 Tab 查看术语 vs 工具详解
      </p>
    </motion.div>
  );
}

/** 结束：工具箱总览 */
export function ToolboxPanel({ tools, color }: { tools: ToolItem[]; color: string }) {
  if (!tools.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pa-panel p-3"
      style={{ borderColor: color + '88' }}
    >
      <p className="text-[10px] font-extrabold mb-2" style={{ color }}>🧰 今日工具箱 · 入门清单</p>
      <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-2">
        {tools.map((t, i) => (
          <ToolCard key={t.name} tool={t} color={color} index={i} />
        ))}
      </motion.div>
      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t" style={{ borderColor: '#eee' }}>
        {(Object.keys(LEARN_LABELS) as LearnLevel[]).map((lv) => (
          <span key={lv} className="flex items-center gap-1 text-[9px]" style={{ color: '#777' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LEARN_COLORS[lv] }} />
            {LEARN_LABELS[lv]}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/** 结束：术语词典（卡片式） */
export function JargonDictionary({ items, color }: { items: { term: string; plain: string }[]; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="pa-panel p-3"
      style={{ borderColor: color + '88' }}
    >
      <p className="text-[10px] font-extrabold mb-2" style={{ color }}>📚 今日术语词典</p>
      <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-1.5">
        {items.map((j) => (
          <TermRow key={j.term} term={j} color={color} />
        ))}
      </motion.div>
    </motion.div>
  );
}
