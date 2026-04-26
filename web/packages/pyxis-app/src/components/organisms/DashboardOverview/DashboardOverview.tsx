import type { AppShow, AuditLogEntry, BookingRequest } from 'pyxis-types';
import { DashboardMobileHeader } from '../DashboardMobileHeader';
import { DashboardMobileCopy } from '../DashboardMobileCopy';
import { DashboardHero } from '../DashboardHero';
import { DashboardMetricsGrid } from '../DashboardMetricsGrid';
import { DashboardAttentionPanel } from '../DashboardAttentionPanel';
import { DashboardUpcomingPanel } from '../DashboardUpcomingPanel';
import { DashboardQuickActionsPanel } from '../DashboardQuickActionsPanel';
import { DashboardActivityPanel } from '../DashboardActivityPanel';
import { appPart } from '../../parts';
import './DashboardOverview.css';

export type DashboardOverviewProps = {
  shows: AppShow[];
  bookings: BookingRequest[];
  log: AuditLogEntry[];
};

export function DashboardOverview({ shows, bookings, log }: DashboardOverviewProps) {
  const upcoming = shows.filter((s) => s.status === 'confirmed').sort((a,b) => a.date.localeCompare(b.date));
  const pending = bookings.filter((b) => b.status === 'pending');
  return <div className="app-dashboard-overview" {...appPart('dashboard-overview')}><DashboardMobileHeader/><DashboardMobileCopy/><DashboardHero show={upcoming[0]}/><DashboardMetricsGrid upcomingCount={upcoming.length} pendingCount={pending.length}/><div className="app-dashboard-mobile-attention"><DashboardAttentionPanel variant="mobile"/></div><div className="app-dashboard-columns"><DashboardUpcomingPanel shows={upcoming}/><div className="app-dashboard-side"><div className="app-dashboard-desktop-quick"><DashboardQuickActionsPanel pendingCount={pending.length}/></div><DashboardActivityPanel log={log}/></div></div></div>;
}
