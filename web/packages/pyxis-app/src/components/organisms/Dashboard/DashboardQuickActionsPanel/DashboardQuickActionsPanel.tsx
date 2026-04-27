import { Panel } from '../../Panel';
import { DashboardQuickActionsContent } from '../DashboardQuickActionsContent';
import './DashboardQuickActionsPanel.css';

export type DashboardQuickActionsPanelProps = {
  pendingCount: number;
  onAddShow?: () => void;
  onReviewBookings?: () => void;
  onOpenAuditLog?: () => void;
};

export function DashboardQuickActionsPanel({ pendingCount, onAddShow, onReviewBookings, onOpenAuditLog }: DashboardQuickActionsPanelProps) { return <Panel title="Quick actions" section="dashboard-quick-actions"><DashboardQuickActionsContent pendingCount={pendingCount} onAddShow={onAddShow} onReviewBookings={onReviewBookings} onOpenAuditLog={onOpenAuditLog}/></Panel>; }
