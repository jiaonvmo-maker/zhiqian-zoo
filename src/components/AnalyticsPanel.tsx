import { useMemo } from 'react';
import { computeFunnel, readLocalEvents } from '@/analytics/localStore';
import { getAnalyticsViewerUrl } from '@/analytics/track';

/** 产品负责人看数据：地址栏加 #pa-data（普通用户不会误进） */
export default function AnalyticsPanel() {
  const events = useMemo(() => readLocalEvents(), []);
  const funnel = useMemo(() => computeFunnel(events), [events]);
  const viewerUrl = getAnalyticsViewerUrl();

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#fdfaf6] p-6 text-sm">
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-lg font-extrabold" style={{ color: 'var(--pa-orange)' }}>
          职前动物园 · 埋点概览
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
          本页仅本地调试可见。全站用户数据请在下方「实时事件流」查看（已自动配置，无需 PostHog）。
        </p>

        {viewerUrl && (
          <a
            href={viewerUrl}
            target="_blank"
            rel="noreferrer"
            className="block pa-btn pa-btn-cream text-center py-3 text-xs font-bold"
          >
            打开实时事件流（所有访问者）↗
          </a>
        )}

        <section className="pa-panel p-4 space-y-2">
          <p className="text-xs font-extrabold">本机漏斗快照</p>
          <ul className="text-xs space-y-1" style={{ color: '#444' }}>
            <li>session_start：{funnel.session_start} 次</li>
            <li>测评完成：{funnel.survey_complete ? '是' : '否'}</li>
            <li>选部门：{funnel.floor_select} 次</li>
            <li>干一天完成：{funnel.work_moment_complete ? '是' : '否'}</li>
            <li>群聊发言：{funnel.chat_message_send} 次</li>
          </ul>
        </section>

        <section className="pa-panel p-4">
          <p className="text-xs font-extrabold mb-2">本机最近事件（{events.length}）</p>
          <ul className="text-[10px] space-y-1 max-h-64 overflow-y-auto font-mono" style={{ color: '#555' }}>
            {[...events].reverse().slice(0, 40).map((e, i) => (
              <li key={`${e.at}-${i}`}>
                {new Date(e.at).toLocaleTimeString()} · {e.event}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[10px] text-center" style={{ color: '#aaa' }}>
          关闭：去掉地址栏 #pa-data 刷新即可
        </p>
      </div>
    </div>
  );
}
