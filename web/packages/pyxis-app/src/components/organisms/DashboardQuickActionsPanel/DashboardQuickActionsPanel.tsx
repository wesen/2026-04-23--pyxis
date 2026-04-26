import { Panel } from '../Panel';
import { DashboardQuickActionsContent } from '../DashboardQuickActionsContent';
import './DashboardQuickActionsPanel.css';
export function DashboardQuickActionsPanel({ pendingCount }: { pendingCount: number }) { return <Panel title="Quick actions" section="dashboard-quick-actions"><DashboardQuickActionsContent pendingCount={pendingCount}/></Panel>; }
