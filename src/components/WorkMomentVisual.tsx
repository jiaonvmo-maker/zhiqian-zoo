import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StepVisual } from '@/data/workMomentTypes';
import { companyContext } from '@/data/companyContext';

interface WorkMomentVisualProps {
  visual: StepVisual;
  color: string;
}

type MetricId = 'dau' | 'open' | 'ret';
type FigmaZone = 'canvas' | 'library' | 'layers';

function BrowserChrome({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden border shadow-sm" style={{ borderColor: '#ddd', backgroundColor: '#fafafa' }}>
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b" style={{ borderColor: '#e8e8e8', backgroundColor: '#f0f0f0' }}>
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center text-[8px] font-bold truncate px-2" style={{ color: '#888' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ExpandPanel({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.22 } }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ClickableChip({ expanded, color }: { expanded: boolean; color: string }) {
  return (
    <span className="text-[6px] font-extrabold px-1 rounded shrink-0" style={{ color, backgroundColor: color + '18' }}>
      {expanded ? '收起' : '点我'}
    </span>
  );
}

function CalloutPulse({ text, color }: { text: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.35 }}
      className="flex items-center gap-1.5 mt-2"
    >
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }} className="text-sm leading-none">
        👆
      </motion.span>
      <span className="text-[9px] font-extrabold px-2 py-1 rounded-full" style={{ color, backgroundColor: color + '18', border: `1.5px solid ${color}` }}>
        {text}
      </span>
    </motion.div>
  );
}

function PulseOverlay({ color, show }: { color: string; show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-md"
      animate={{ opacity: [0.2, 0.45, 0.2] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      style={{ backgroundColor: color + '12' }}
    />
  );
}

function MetricCardButton({
  label, value, delta, good, expanded, color, index, onClick,
}: {
  label: string; value: string; delta: string; good: boolean; expanded: boolean;
  color: string; index: number; onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
      whileTap={{ scale: 0.96 }}
      className="rounded-md p-1.5 relative overflow-hidden text-left w-full cursor-pointer"
      style={{
        backgroundColor: '#fff',
        border: `2px solid ${color}`,
        boxShadow: expanded ? `0 0 0 3px ${color}33` : `0 0 0 2px ${color}18`,
      }}
    >
      <PulseOverlay color={color} show={!expanded} />
      <p className="text-[7px] font-bold relative flex items-center gap-0.5 flex-wrap" style={{ color: '#999' }}>
        <span className="truncate">{label}</span>
        <ClickableChip expanded={expanded} color={color} />
      </p>
      <p className="text-[11px] font-extrabold relative" style={{ color: '#333' }}>{value}</p>
      <p className="text-[7px] font-bold relative" style={{ color: good ? '#34c759' : '#e85d4c' }}>{delta}</p>
    </motion.button>
  );
}

function PushFunnelInline({ color, animate: runAnim }: { color: string; animate?: boolean }) {
  const steps = [
    { name: '收到推送', pct: 100, w: '100%' },
    { name: '点击通知', pct: 62, w: '62%' },
    { name: '打开 App', pct: 37, w: '37%', warn: true },
    { name: '完成设置', pct: 28, w: '28%' },
  ];
  return (
    <div className="rounded-md p-2" style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
      <p className="text-[8px] font-extrabold mb-1.5" style={{ color: '#666' }}>推送转化漏斗 · 看掉在哪一步</p>
      <div className="space-y-1.5">
        {steps.map((s, i) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="text-[8px] font-bold w-14 shrink-0 text-right" style={{ color: '#666' }}>{s.name}</span>
            <div className="flex-1 h-4 rounded-md overflow-hidden" style={{ backgroundColor: '#eee' }}>
              <motion.div
                initial={runAnim ? { width: 0 } : false}
                animate={{ width: s.w }}
                transition={{ delay: runAnim ? 0.1 + i * 0.15 : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-md flex items-center justify-end pr-1"
                style={{ backgroundColor: s.warn ? '#e85d4c' : color, opacity: s.warn ? 0.9 : 0.65 + i * 0.08 }}
              >
                <span className="text-[7px] font-extrabold text-white">{s.pct}%</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <motion.p initial={runAnim ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: runAnim ? 0.75 : 0 }}
        className="text-[7px] mt-1.5 font-bold text-center" style={{ color: '#e85d4c' }}>
        ⚠️ 第三步「打开 App」掉最多 — 产品要查这一步
      </motion.p>
    </div>
  );
}

function MetricDetailPanel({ id, color }: { id: MetricId; color: string }) {
  const { metrics } = companyContext;
  if (id === 'dau') {
    return (
      <div className="rounded-md p-2" style={{ backgroundColor: '#fff', border: `1px solid ${color}44` }}>
        <p className="text-[8px] font-extrabold mb-1" style={{ color }}>DAU 是什么？</p>
        <p className="text-[8px] leading-snug" style={{ color: '#555' }}>
          Daily Active Users = 当天打开记记 App 的用户数。产品每天先看大盘稳不稳，再决定深入查哪个功能。
        </p>
        <div className="flex items-end gap-0.5 h-8 mt-2 px-1">
          {[40, 55, 48, 62, 58, 70, 65].map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
              className="flex-1 rounded-sm min-h-[4px]" style={{ backgroundColor: i === 6 ? color : color + '55' }} />
          ))}
        </div>
        <p className="text-[7px] mt-1 text-right" style={{ color: '#aaa' }}>近 7 日趋势 · 今日 {metrics.dau}</p>
      </div>
    );
  }
  if (id === 'open') {
    return (
      <div className="space-y-2">
        <div className="rounded-md p-2" style={{ backgroundColor: '#fff', border: `1px solid ${color}44` }}>
          <p className="text-[8px] font-extrabold mb-1" style={{ color }}>推送打开率是什么？</p>
          <p className="text-[8px] leading-snug" style={{ color: '#555' }}>
            收到推送的用户里，有多少人点了通知。记记这次上线第 3 天起打开率掉 40%，所以要拆漏斗找掉在哪一步。
          </p>
        </div>
        <PushFunnelInline color={color} animate />
      </div>
    );
  }
  return (
    <div className="rounded-md p-2" style={{ backgroundColor: '#fff', border: `1px solid ${color}44` }}>
      <p className="text-[8px] font-extrabold mb-1" style={{ color }}>次日留存是什么？</p>
      <p className="text-[8px] leading-snug mb-2" style={{ color: '#555' }}>
        今天来的用户，明天还会不会打开 App。推送如果只拉一波点击、留不住人，DAU 也涨不动。
      </p>
      <div className="flex items-end justify-center gap-3 h-10">
        {[{ label: 'D1', pct: 34, hi: true }, { label: 'D3', pct: 22 }, { label: 'D7', pct: 15 }].map((d, i) => (
          <div key={d.label} className="flex flex-col items-center gap-0.5">
            <motion.div initial={{ height: 0 }} animate={{ height: `${d.pct * 0.85}px` }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.45 }}
              className="w-5 rounded-t-sm" style={{ backgroundColor: d.hi ? color : color + '44', minHeight: 4 }} />
            <span className="text-[6px] font-bold" style={{ color: '#999' }}>{d.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[7px] mt-1.5 text-center" style={{ color: '#aaa' }}>留存曲线 · 次日 34.2%</p>
    </div>
  );
}

function DauDashboardMock({ color }: { color: string }) {
  const { productName, metrics, stack } = companyContext;
  const [activeNav, setActiveNav] = useState(0);
  const [expanded, setExpanded] = useState<MetricId | null>(null);
  const navItems = ['概览', '推送分析', '用户行为'];

  useEffect(() => {
    const t = setTimeout(() => setActiveNav(1), 800);
    return () => clearTimeout(t);
  }, []);

  const cards: { id: MetricId; label: string; value: string; delta: string; good: boolean }[] = [
    { id: 'dau', label: 'DAU · 记记', value: metrics.dau, delta: '+0.3%', good: true },
    { id: 'open', label: '推送打开率', value: metrics.pushOpenRate, delta: '-40% 第3天起', good: false },
    { id: 'ret', label: '次日留存', value: '34.2%', delta: '-0.1%', good: false },
  ];

  return (
    <BrowserChrome title={`${stack.data} · ${productName} 数据看板`}>
      <div className="flex min-h-[140px]">
        <div className="w-[72px] shrink-0 border-r py-2" style={{ borderColor: '#eee', backgroundColor: '#fff' }}>
          {navItems.map((n, i) => (
            <motion.div key={n}
              animate={{ backgroundColor: activeNav === i ? color + '22' : 'transparent', color: activeNav === i ? color : '#999' }}
              className="px-2 py-1.5 text-[8px] font-bold">{n}</motion.div>
          ))}
        </div>
        <div className="flex-1 p-2" style={{ backgroundColor: '#f7f8fa' }}>
          <p className="text-[8px] font-bold mb-1.5" style={{ color: '#aaa' }}>推送分析 · 早报 09:30</p>
          <div className="grid grid-cols-3 gap-1">
            {cards.map((c, i) => (
              <MetricCardButton key={c.id} {...c} expanded={expanded === c.id} color={color} index={i}
                onClick={() => setExpanded((cur) => (cur === c.id ? null : c.id))} />
            ))}
          </div>
          {!expanded && <CalloutPulse text="点任意指标卡片，展开白话解释" color={color} />}
          <ExpandPanel show={expanded !== null}>
            <div className="mt-2 pt-2 border-t" style={{ borderColor: color + '33' }}>
              <AnimatePresence mode="wait">
                <motion.div key={expanded} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                  {expanded && <MetricDetailPanel id={expanded} color={color} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </ExpandPanel>
        </div>
      </div>
    </BrowserChrome>
  );
}

function FigmaDetailPanel({ zone, color }: { zone: FigmaZone; color: string }) {
  const copy: Record<FigmaZone, { title: string; body: string; tags?: string[] }> = {
    layers: {
      title: 'Layers · 图层列表',
      body: '左侧列出页面里每个元素。CTA Button 是产品最关心的「希望用户点的按钮」——评审时常指着这一层说「再醒目一点」。',
    },
    canvas: {
      title: '画布区 · 设计师主战场',
      body: '中间灰色区域是画布，在 Frame 里画记记推送设置页。开发对照这里做还原，走查也是拿真机和这一屏比。',
      tags: ['默认态', '空状态', '错误态'],
    },
    library: {
      title: 'Team Library · 组件库',
      body: '右侧是公司统一组件。拖 Primary Button 改文案即可，别手画新按钮——改 Master 组件，全项目同步更新。',
    },
  };
  const c = copy[zone];
  return (
    <div className="rounded-md p-2" style={{ backgroundColor: '#fff', border: `1px solid ${color}44` }}>
      <p className="text-[8px] font-extrabold mb-1" style={{ color }}>{c.title}</p>
      <p className="text-[8px] leading-snug" style={{ color: '#555' }}>{c.body}</p>
      {c.tags && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {c.tags.map((s, i) => (
            <motion.span key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }} className="text-[7px] font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: color + '15', color }}>{s}</motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

function FigmaWorkspaceMock({ color }: { color: string }) {
  const [expanded, setExpanded] = useState<FigmaZone | null>(null);
  const toggle = (z: FigmaZone) => setExpanded((cur) => (cur === z ? null : z));
  const is = (z: FigmaZone) => expanded === z;

  const zoneStyle = (z: FigmaZone) => ({
    border: `2px solid ${is(z) ? color : 'transparent'}`,
    boxShadow: is(z) ? `0 0 0 3px ${color}33` : `inset 0 0 0 1px ${color}22`,
  });

  return (
    <BrowserChrome title="Figma · 记记·推送设置 v3">
      <div className="flex min-h-[150px]">
        <div className="w-10 shrink-0 border-r py-1" style={{ borderColor: '#eee', backgroundColor: '#2c2c2c' }}>
          {['▦', '◇', 'T', '◻'].map((icon, i) => (
            <div key={i} className="text-[8px] text-center py-1 opacity-60 text-white">{icon}</div>
          ))}
        </div>

        <motion.button type="button" onClick={() => toggle('layers')} whileTap={{ scale: 0.98 }}
          className="w-16 shrink-0 border-r py-1 px-1 relative text-left cursor-pointer"
          style={{ borderColor: '#eee', backgroundColor: '#fff', ...zoneStyle('layers') }}>
          <PulseOverlay color={color} show={!is('layers')} />
          <p className="text-[6px] font-bold mb-1 relative flex items-center justify-between" style={{ color: '#aaa' }}>
            Layers <ClickableChip expanded={is('layers')} color={color} />
          </p>
          {['Frame 推送', 'Header', 'CTA Button'].map((l, i) => (
            <p key={l} className="text-[6px] py-0.5 truncate relative"
              style={{ color: i === 2 ? color : '#666', fontWeight: i === 2 ? 800 : 400 }}>{l}</p>
          ))}
        </motion.button>

        <motion.button type="button" onClick={() => toggle('canvas')} whileTap={{ scale: 0.98 }}
          className="flex-1 relative p-2 text-left cursor-pointer"
          style={{ backgroundColor: '#e5e5e5', ...zoneStyle('canvas') }}>
          <PulseOverlay color={color} show={!is('canvas')} />
          <span className="absolute top-1 right-1 z-10"><ClickableChip expanded={is('canvas')} color={color} /></span>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="mx-auto w-[72px] rounded-xl overflow-hidden shadow-md border-2 border-white pointer-events-none">
            <div className="h-4 px-1 flex items-center" style={{ backgroundColor: color + 'cc' }}>
              <span className="text-[5px] text-white font-bold">记记 · 推送设置</span>
            </div>
            <div className="bg-white p-1.5 space-y-1">
              <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: '#eee' }} />
              <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: '#eee' }} />
              <div className="h-4 rounded-md flex items-center justify-center" style={{ backgroundColor: color }}>
                <span className="text-[5px] text-white font-bold">开启推送</span>
              </div>
            </div>
          </motion.div>
          <p className="text-[6px] text-center mt-1 relative font-bold" style={{ color: '#999' }}>画布 · 点我展开</p>
        </motion.button>

        <motion.button type="button" onClick={() => toggle('library')} whileTap={{ scale: 0.98 }}
          className="w-[58px] shrink-0 border-l p-1 relative text-left cursor-pointer"
          style={{ borderColor: '#eee', backgroundColor: '#fff', ...zoneStyle('library') }}>
          <PulseOverlay color={color} show={!is('library')} />
          <p className="text-[6px] font-extrabold mb-1 relative flex flex-col gap-0.5" style={{ color }}>
            <span>Team Library</span>
            <ClickableChip expanded={is('library')} color={color} />
          </p>
          {['Primary Btn', 'Input', 'Nav Bar'].map((c) => (
            <div key={c} className="text-[6px] py-0.5 px-1 rounded mb-0.5" style={{ backgroundColor: color + '12', color: '#555' }}>{c}</div>
          ))}
        </motion.button>
      </div>

      {!expanded && <div className="px-2 pb-2"><CalloutPulse text="点 Layers / 画布 / 组件库，展开说明" color={color} /></div>}

      <div className="px-2 pb-2">
        <ExpandPanel show={expanded !== null}>
          <AnimatePresence mode="wait">
            <motion.div key={expanded} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {expanded && <FigmaDetailPanel zone={expanded} color={color} />}
            </motion.div>
          </AnimatePresence>
        </ExpandPanel>
      </div>
    </BrowserChrome>
  );
}

const VISUAL_MAP: Record<StepVisual['id'], (props: { color: string }) => ReactNode> = {
  'dau-dashboard': DauDashboardMock,
  'push-funnel': ({ color }) => (
    <BrowserChrome title="推送转化漏斗 · 记记 App">
      <div className="p-2.5" style={{ backgroundColor: '#f7f8fa' }}>
        <PushFunnelInline color={color} animate />
      </div>
    </BrowserChrome>
  ),
  'figma-workspace': FigmaWorkspaceMock,
};

export default function WorkMomentVisual({ visual, color }: WorkMomentVisualProps) {
  const Mock = VISUAL_MAP[visual.id];
  if (!Mock) return null;

  return (
    <motion.div key={visual.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }} className="mx-1 mb-2">
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <p className="text-[9px] font-extrabold" style={{ color }}>🎬 实景示意 · 点区域展开</p>
        {visual.hint && (
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{ color, backgroundColor: color + '15' }}>
            {visual.hint}
          </span>
        )}
      </div>
      <Mock color={color} />
      <p className="text-[9px] text-center mt-1.5 leading-snug px-1" style={{ color: '#888' }}>{visual.caption}</p>
    </motion.div>
  );
}
