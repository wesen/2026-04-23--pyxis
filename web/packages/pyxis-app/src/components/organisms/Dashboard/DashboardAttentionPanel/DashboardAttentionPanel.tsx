import { Panel } from '../../Panel';
import { DashboardAttentionContent, defaultDashboardAttentionItems, type DashboardAttentionItem } from '../DashboardAttentionContent';
import { DashboardAttentionCount } from '../DashboardAttentionCount';
import './DashboardAttentionPanel.css';

export type DashboardAttentionPanelVariant = 'desktop' | 'mobile';

export type DashboardAttentionPanelProps = {
  variant?: DashboardAttentionPanelVariant;
  items?: DashboardAttentionItem[];
};

export function DashboardAttentionPanel({ variant = 'desktop', items = defaultDashboardAttentionItems }: DashboardAttentionPanelProps) { return <Panel title="Needs your attention" action={variant === 'mobile' ? <DashboardAttentionCount count={items.length}/> : undefined} section="dashboard-attention"><DashboardAttentionContent items={items}/></Panel>; }
