import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** 各部门「干一天」可点示意 — 统一卡片展开模式 */

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

function CalloutPulse({ text, color }: { text: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.35 }}
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

export interface ToolCard {
  id: string;
  label: string;
  value: string;
  note: string;
  warn?: boolean;
  detailTitle: string;
  detail: string;
  chips?: string[];
}

function ExpandableCardsMock({
  title,
  subtitle,
  cards,
  color,
  callout,
  cols = 3,
}: {
  title: string;
  subtitle: string;
  cards: ToolCard[];
  color: string;
  callout: string;
  cols?: 2 | 3;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const active = cards.find((c) => c.id === expanded);

  return (
    <BrowserChrome title={title}>
      <div className="p-2" style={{ backgroundColor: '#f7f8fa' }}>
        <p className="text-[8px] font-bold mb-1.5" style={{ color: '#aaa' }}>{subtitle}</p>
        <div className={cols === 2 ? 'grid grid-cols-2 gap-1' : 'grid grid-cols-3 gap-1'}>
          {cards.map((c, i) => {
            const on = expanded === c.id;
            return (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => setExpanded((cur) => (cur === c.id ? null : c.id))}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-md p-1.5 relative overflow-hidden text-left w-full cursor-pointer"
                style={{
                  backgroundColor: '#fff',
                  border: `2px solid ${on ? color : '#e8e8e8'}`,
                  boxShadow: on ? `0 0 0 3px ${color}22` : `0 0 0 1px ${color}10`,
                }}
              >
                <PulseOverlay color={color} show={!expanded} />
                <p className="text-[7px] font-bold relative flex items-center gap-0.5 flex-wrap" style={{ color: '#999' }}>
                  <span className="truncate">{c.label}</span>
                  <span className="text-[6px] font-extrabold px-1 rounded shrink-0" style={{ color, backgroundColor: color + '18' }}>
                    {on ? '收起' : '点我'}
                  </span>
                </p>
                <p className="text-[11px] font-extrabold relative" style={{ color: c.warn ? '#e85d4c' : '#333' }}>{c.value}</p>
                <p className="text-[7px] font-bold relative leading-tight" style={{ color: '#777' }}>{c.note}</p>
              </motion.button>
            );
          })}
        </div>

        {!expanded && <CalloutPulse text={callout} color={color} />}

        <ExpandPanel show={expanded !== null}>
          <div className="mt-2 rounded-md p-2" style={{ backgroundColor: '#fff', border: `1px solid ${color}44` }}>
            <AnimatePresence mode="wait">
              {active && (
                <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                  <p className="text-[8px] font-extrabold mb-1" style={{ color }}>{active.detailTitle}</p>
                  <p className="text-[8px] leading-snug" style={{ color: '#555' }}>{active.detail}</p>
                  {active.chips && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {active.chips.map((chip, i) => (
                        <motion.span
                          key={chip}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className="text-[7px] font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: color + '15', color }}
                        >
                          {chip}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ExpandPanel>
      </div>
    </BrowserChrome>
  );
}

export function TechOncallMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="Sentry · 记记 线上告警"
      subtitle="Oncall · 今晚轮到你值班"
      callout="点告警卡片，看工程师真实在盯什么"
      color={color}
      cards={[
        {
          id: 'err',
          label: 'Error Rate',
          value: '2.4%',
          note: '↑ 突增 3×',
          warn: true,
          detailTitle: '错误率突然涨了？',
          detail: '短时间报错变多，通常是新版本、坏配置或下游接口挂了。Oncall 第一反应：看有没有刚上线的改动。',
          chips: ['新版本', '配置', '下游超时'],
        },
        {
          id: 'p95',
          label: 'P95 延迟',
          value: '1.8s',
          note: '红了',
          warn: true,
          detailTitle: 'P95 是什么？',
          detail: '100 次请求里最慢那 5% 的耗时。只看平均值容易被「大部分很快」骗到——真正卡用户的是尾巴。',
          chips: ['均值骗人', '看长尾'],
        },
        {
          id: 'owner',
          label: 'Assignee',
          value: '你',
          note: '15 min SLA',
          detailTitle: 'Assignee = 值班的人',
          detail: '告警派给你不是怪你写的，是今晚你负责响应。超时没认领，会影响团队 oncall 考核。',
          chips: ['认领', '升级', '复盘'],
        },
      ]}
    />
  );
}

export function OpsAnalyticsMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="飞瓜 / 后台 · 内容经营看板"
      subtitle="昨日笔记复盘 · 09:40"
      callout="点指标卡片，看运营每天开盘先看啥"
      color={color}
      cards={[
        {
          id: 'imp',
          label: '曝光',
          value: '1.2w',
          note: '中规中矩',
          detailTitle: '曝光 / 阅读',
          detail: '多少人刷到了你的内容。曝光低先查：标题封面、发布时间、账号权重，别急着怪文案「不够有情怀」。',
          chips: ['封面', '标题', '时段'],
        },
        {
          id: 'ctr',
          label: '点击率',
          value: '3.1%',
          note: '低于均值',
          warn: true,
          detailTitle: 'CTR 掉了怎么办？',
          detail: '看到的人里有多少点进去。封面/标题决定了这一步——运营常把爆款拆成「结构」再换皮测试。',
          chips: ['对比爆款', 'AB 封面'],
        },
        {
          id: 'cvr',
          label: '转化',
          value: '0.4%',
          note: 'CTA 偏弱',
          warn: true,
          detailTitle: '转化不是玄学',
          detail: '点进以后有没有下载 / 领券 / 下单。没有清晰 CTA，「种草」就停在观赏环节。',
          chips: ['CTA', '落地页'],
        },
      ]}
    />
  );
}

export function CrmPipelineMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="Salesforce · 记记 Pipeline"
      subtitle="本季业绩进度 · 还差 ¥40 万"
      callout="点阶段卡片，看销售每天在盘啥"
      color={color}
      cols={2}
      cards={[
        {
          id: 'lead',
          label: '线索',
          value: '28',
          note: '顶端很多',
          detailTitle: 'Pipeline 顶端',
          detail: '线索多不代表能成交。销售要盯「哪几个阶段离签约最近」，别把时间全耗在加微信上。',
          chips: ['线索', '意向'],
        },
        {
          id: 'quote',
          label: '报价中',
          value: '6',
          note: '王总 / 李总',
          detailTitle: '报价 = 快签区',
          detail: '进入报价说明客户认真了。这时要盯合同、折扣、竞品比价——再拖可能飞单。',
          chips: ['折扣', '比价', '法务'],
        },
        {
          id: 'risk',
          label: '风险单',
          value: '2',
          note: '本周要凉',
          warn: true,
          detailTitle: '风险客户',
          detail: '对方不回、预算砍了、换了决策人。CRM 记清楚，不然老板问「为啥挂了」你只能编。',
          chips: ['失联', '预算砍'],
        },
        {
          id: 'won',
          label: '已签约',
          value: '¥180万',
          note: '完成 82%',
          detailTitle: '成交也要录 CRM',
          detail: '签完不算完：回款节点、续约负责人、客户成功接手——漏记等于白签。',
          chips: ['回款', '续约'],
        },
      ]}
    />
  );
}

export function HrAtsMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="北森 / Moka · 招聘漏斗"
      subtitle="产品专员岗 · 本周"
      callout="点漏斗层，看 HR 每天在筛什么"
      color={color}
      cards={[
        {
          id: 'cv',
          label: '简历投递',
          value: '216',
          note: '待筛 84',
          detailTitle: '海选阶段',
          detail: '业务要「资深的」，预算却写着校招带宽。HC / JD 没对齐，你筛再久都对不上。',
          chips: ['HC', 'JD', '带宽'],
        },
        {
          id: 'iv',
          label: '约面',
          value: '12',
          note: '3 人改期',
          warn: true,
          detailTitle: '协调是体力活',
          detail: '候选人和面试官日历永远对不齐。HR 价值在催而不炸、改而不乱，记录写进 ATS。',
          chips: ['日历', '提醒'],
        },
        {
          id: 'offer',
          label: 'Offer',
          value: '2',
          note: '1 人还价',
          detailTitle: '发 Offer 不是终点',
          detail: '还价、背调、入职材料任一环节卡住都能黄。口头承诺薪资险过大，写进系统才算数。',
          chips: ['还价', '背调', '入职'],
        },
      ]}
    />
  );
}

export function FinanceExpenseMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="费控系统 · 报销审批"
      subtitle="待审 37 单 · 关账倒计时 2 天"
      callout="点单据卡片，看财务为啥总「卡住」"
      color={color}
      cards={[
        {
          id: 'title',
          label: '抬头异常',
          value: '8',
          note: '退回重开',
          warn: true,
          detailTitle: '发票抬头',
          detail: '发票公司名必须和报销主体一致。错了不是找茬——审计查到是财务背锅。',
          chips: ['抬头', '税号'],
        },
        {
          id: 'budget',
          label: '超预算',
          value: '3',
          note: '需特批',
          warn: true,
          detailTitle: '预算墙',
          detail: '部门今年能花多少写在预算里。超了就走特批，不是「先花再说」。',
          chips: ['特批', '成本中心'],
        },
        {
          id: 'match',
          label: '三单匹配',
          value: 'OK',
          note: '合同·票·验收',
          detailTitle: '三单匹配是什么？',
          detail: '合同金额、发票金额、验收金额要能对上。对不上就是舞弊红灯，系统会拦。',
          chips: ['合同', '发票', '验收'],
        },
      ]}
    />
  );
}

export function LegalContractMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="合同审阅 · 记记 × 客户王总"
      subtitle="销售催签 · 今晚 DDL"
      callout="点条款卡片，看法务盯哪里"
      color={color}
      cards={[
        {
          id: 'liab',
          label: '第 7 条',
          value: '无限责任',
          note: '必须改',
          warn: true,
          detailTitle: '无限责任为啥吓人？',
          detail: '出了事公司可能赔到血本无归。法务会标红给可接受上限，不是故意卡住成交。',
          chips: ['标红', '改上限'],
        },
        {
          id: 'ip',
          label: '知识产权',
          value: '归对方？',
          note: '定制开发',
          warn: true,
          detailTitle: '成果归谁',
          detail: '尤其定制功能：源码、设计、数据归谁要写死。写糊了等于给对方打工。',
          chips: ['源码', '许可'],
        },
        {
          id: 'arb',
          label: '管辖',
          value: '对方地',
          note: '可谈',
          detailTitle: '管辖 / 仲裁',
          detail: '打官司去哪很现实：成本、时间、熟人优势。法务会尽量拉回公司友好管辖。',
          chips: ['仲裁', '法院'],
        },
      ]}
    />
  );
}

export function MgmtOkrMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="飞书 OKR · 本季经营目标"
      subtitle="CEO 下发 · 需拆到团队"
      callout="点目标卡片，看管理层到底在对齐啥"
      color={color}
      cards={[
        {
          id: 'rev',
          label: '营收 O',
          value: '×2',
          note: '口号味重',
          warn: true,
          detailTitle: 'Objective 不等于数字',
          detail: '「翻倍」是愿景。管理要把他拆成可验收的 KR：哪条产品线、哪个渠道、多少绝对值。',
          chips: ['拆 KR', '分期'],
        },
        {
          id: 'cost',
          label: '成本 KR',
          value: '-50%',
          note: '缺人力假设',
          warn: true,
          detailTitle: '资源后谈的陷阱',
          detail: '目标先定、HC/预算后谈，是管理层日常。你要带着缺口表回去谈，否则团队接了也完不成。',
          chips: ['HC', '预算'],
        },
        {
          id: 'align',
          label: '对齐度',
          value: '62%',
          note: '部门各说各',
          detailTitle: '对齐是体力活',
          detail: '产品要做功能、销售要折扣、财务要控费。OKR 会议就是逼各方说出「牺牲什么」。',
          chips: ['取舍', '1:1'],
        },
      ]}
    />
  );
}

export function SupportTicketMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="客服工作台 · 在线队列"
      subtitle="首响 SLA 90 秒 · 排队 41"
      callout="点工单卡片，看客服首响在抢什么"
      color={color}
      cards={[
        {
          id: 'q',
          label: '排队',
          value: '41',
          note: '高峰',
          warn: true,
          detailTitle: '队列压力',
          detail: '人一多，平均等待变长。客服要在「快回」和「回清楚」之间取舍，超时直接扣 KPI。',
          chips: ['排队', '分流'],
        },
        {
          id: 'sla',
          label: '本单剩余',
          value: '47s',
          note: '红了',
          warn: true,
          detailTitle: 'SLA / 首响',
          detail: '第一次回复必须在时限内。可以先安抚占坑，再去查原因——空白超时最致命。',
          chips: ['先安抚', '再排查'],
        },
        {
          id: 'tag',
          label: '问题标签',
          value: '数据丢失',
          note: '可能升级',
          detailTitle: '工单要可追溯',
          detail: '标好类型才能统计、升级技术。回完不打标，等于白处理一单，周报也没数。',
          chips: ['升级', '备注'],
        },
      ]}
    />
  );
}

export function DataBiMock({ color }: { color: string }) {
  return (
    <ExpandableCardsMock
      title="RedBI · 记记经营看板"
      subtitle="口径 v3 · 产品催数"
      callout="点模块卡片，看数据分析日常在干啥"
      color={color}
      cards={[
        {
          id: 'sql',
          label: '取数 SQL',
          value: 'Running',
          note: '2m 14s',
          detailTitle: '写 SQL 只是一半',
          detail: '真正耗时是口径：DAU 算不算游客？跟上周是否同一套逻辑？不问清楚就会返工。',
          chips: ['口径', '时间窗'],
        },
        {
          id: 'chart',
          label: '看板刷新',
          value: '延迟',
          note: 'ETL 卡住',
          warn: true,
          detailTitle: 'BI 不等于实时',
          detail: '看板背后有数仓同步。业务喊「数不对」时，先查刷新时间和口径变更，再怀疑自己。',
          chips: ['ETL', '刷新'],
        },
        {
          id: 'cohort',
          label: 'Cohort',
          value: 'D1↓',
          note: '新用户',
          warn: true,
          detailTitle: 'Cohort 白话',
          detail: '同一天注册的人放一队，看他们之后还来不来。比看总 DAU 更能发现「哪批人开始流失」。',
          chips: ['新用户', '老用户'],
        },
      ]}
    />
  );
}
