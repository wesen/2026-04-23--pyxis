import { AppEmptyState } from '../../molecules/AppEmptyState';
import { defaultDashboardAttentionItems, type DashboardAttentionItem } from './dashboardAttentionData';
import './DashboardAttentionContent.css';

export type DashboardAttentionContentProps = { items?: DashboardAttentionItem[] };

export function DashboardAttentionContent({ items = defaultDashboardAttentionItems }: DashboardAttentionContentProps) {
  if (items.length === 0) return <AppEmptyState title="No issues need attention right now." />;
  return <div className="app-attention-list">{items.map(({ tone, title, caption }) => <article key={title} className="app-attention-item" data-tone={tone}><b>{tone === 'info' ? '✺' : '△'}</b><div><strong>{title}</strong><span>{caption}</span></div><em>›</em></article>)}</div>;
}
