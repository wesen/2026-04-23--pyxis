import { MetricCard } from '../../molecules/MetricCard';
import './DashboardMetricsGrid.css';

export function DashboardMetricsGrid({ upcomingCount, pendingCount, variant = 'desktop' }: { upcomingCount: number; pendingCount: number; variant?: 'desktop' | 'mobile' }) {
  const mobile = variant === 'mobile';
  return (
    <div className="app-metrics-grid" data-section="dashboard-metrics" data-variant={variant}>
      <MetricCard label="Upcoming" value={upcomingCount} caption={mobile ? 'next 60 days' : 'Next 60 days'} tone="accent" />
      <MetricCard label={mobile ? 'Pending' : 'Pending bookings'} value={pendingCount} caption={mobile ? 'review needed' : 'Awaiting review'} trend={mobile ? undefined : '2 new today'} tone="warning" />
      <MetricCard label="Avg draw" value="84" caption={mobile ? 'last 6 shows' : 'Last 6 shows'} trend={mobile ? undefined : '↑ 12 vs. prior 6'} tone="success" />
      <MetricCard label={mobile ? 'Capacity' : 'Capacity use'} value="56%" caption="May 2025" tone="info" />
    </div>
  );
}
