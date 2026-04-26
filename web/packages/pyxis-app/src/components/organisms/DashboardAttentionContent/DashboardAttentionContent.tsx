import './DashboardAttentionContent.css';

export type DashboardAttentionItem = { tone: 'warning' | 'info' | 'danger'; title: string; caption: string; };
export const defaultDashboardAttentionItems: DashboardAttentionItem[] = [
  { tone: 'warning', title: '2 past shows need logging', caption: 'Planning for Burial · Actress' },
  { tone: 'info', title: 'Zola Jesus · Jun 6', caption: 'Check price for a 160-draw headliner' },
  { tone: 'danger', title: 'Discord token expires in 14d', caption: 'Reconnect to keep pinning working' },
];
export function DashboardAttentionCount({ count = defaultDashboardAttentionItems.length }: { count?: number }) { return <span className="app-attention-count">{count}</span>; }
export function DashboardAttentionContent({ items = defaultDashboardAttentionItems }: { items?: DashboardAttentionItem[] }) {
  if (items.length === 0) return <p className="app-empty-state">No issues need attention right now.</p>;
  return <div className="app-attention-list">{items.map(({ tone, title, caption }) => <article key={title} className="app-attention-item" data-tone={tone}><b>{tone === 'info' ? '✺' : '△'}</b><div><strong>{title}</strong><span>{caption}</span></div><em>›</em></article>)}</div>;
}
