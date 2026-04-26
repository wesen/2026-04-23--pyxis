import { Button } from 'pyxis-components';
import './DashboardQuickActionsContent.css';

export type DashboardQuickActionsContentProps = {
  pendingCount: number;
  onAddShow?: () => void;
  onReviewBookings?: () => void;
  onOpenAuditLog?: () => void;
};

export function DashboardQuickActionsContent({ pendingCount, onAddShow, onReviewBookings, onOpenAuditLog }: DashboardQuickActionsContentProps) {
  return <div className="app-quick-actions"><Button fullWidth iconLeft="plus" onClick={onAddShow}>Add a show</Button><Button fullWidth variant="outline" iconLeft="mail" onClick={onReviewBookings}>Review bookings · {pendingCount}</Button><Button fullWidth variant="ghost" iconLeft="log" onClick={onOpenAuditLog}>Open audit log</Button></div>;
}
