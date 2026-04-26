import { Button } from 'pyxis-components';
import './DashboardQuickActionsContent.css';

export function DashboardQuickActionsContent({ pendingCount }: { pendingCount: number }) {
  return <div className="app-quick-actions"><Button fullWidth iconLeft="plus">Add a show</Button><Button fullWidth variant="outline" iconLeft="mail">Review bookings · {pendingCount}</Button><Button fullWidth variant="ghost" iconLeft="log">Open audit log</Button></div>;
}
