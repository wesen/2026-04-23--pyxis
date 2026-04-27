import { defaultDashboardAttentionItems } from '../DashboardAttentionContent';
import './DashboardAttentionCount.css';

export type DashboardAttentionCountProps = { count?: number };

export function DashboardAttentionCount({ count = defaultDashboardAttentionItems.length }: DashboardAttentionCountProps) { return <span className="app-attention-count">{count}</span>; }
