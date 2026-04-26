import { Panel } from '../Panel';
import { DashboardAttentionContent, DashboardAttentionCount, defaultDashboardAttentionItems, type DashboardAttentionItem } from '../DashboardAttentionContent';
import './DashboardAttentionPanel.css';
export function DashboardAttentionPanel({ variant = 'desktop', items = defaultDashboardAttentionItems }: { variant?: 'desktop' | 'mobile'; items?: DashboardAttentionItem[] }) { return <Panel title="Needs your attention" action={variant === 'mobile' ? <DashboardAttentionCount count={items.length}/> : undefined} section="dashboard-attention"><DashboardAttentionContent items={items}/></Panel>; }
