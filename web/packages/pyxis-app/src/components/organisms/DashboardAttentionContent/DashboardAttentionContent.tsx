import './DashboardAttentionContent.css';
import { AppEmptyState } from '../../molecules/AppEmptyState';

export type DashboardAttentionTone = 'warning' | 'info' | 'danger';
export type DashboardAttentionItem = { tone: DashboardAttentionTone; title: string; caption: string; };
export const defaultDashboardAttentionItems: DashboardAttentionItem[] = [
  { tone: 'warning', title: '2 past shows need logging', caption: 'Planning for Burial · Actress' },
  { tone: 'info', title: 'Zola Jesus · Jun 6', caption: 'Check price for a 160-draw headliner' },
  { tone: 'danger', title: 'Discord token expires in 14d', caption: 'Reconnect to keep pinning working' },
];
export type DashboardAttentionCountProps = { count?: number };
export type DashboardAttentionContentProps = { items?: DashboardAttentionItem[] };
export function DashboardAttentionCount({ count = defaultDashboardAttentionItems.length }: DashboardAttentionCountProps) { return <span className="app-attention-count">{count}</span>; }
export function DashboardAttentionContent({ items = defaultDashboardAttentionItems }: DashboardAttentionContentProps) {
  if (items.length === 0) return <AppEmptyState title="No issues need attention right now." />;
  return <div className="app-attention-list">{items.map(({ tone, title, caption }) => <article key={title} className="app-attention-item" data-tone={tone}><b>{tone === 'info' ? '✺' : '△'}</b><div><strong>{title}</strong><span>{caption}</span></div><em>›</em></article>)}</div>;
}
