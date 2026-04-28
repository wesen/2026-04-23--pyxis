import type { AppShow, AuditLogEntry, Submission } from 'pyxis-types';
import { ShowStatus, SubmissionStatus } from 'pyxis-types';
import { DashboardMobileHeader } from '../DashboardMobileHeader';
import { DashboardMobileCopy } from '../DashboardMobileCopy';
import { DashboardHero } from '../DashboardHero';
import { DashboardMetricsGrid } from '../DashboardMetricsGrid';
import { DashboardAttentionPanel } from '../DashboardAttentionPanel';
import { DashboardUpcomingPanel } from '../DashboardUpcomingPanel';
import { DashboardQuickActionsPanel } from '../DashboardQuickActionsPanel';
import { DashboardActivityPanel } from '../DashboardActivityPanel';
import { appPart } from '../../../parts';
import './DashboardOverview.css';

export type DashboardOverviewProps = {
  shows: AppShow[];
  bookings: Submission[];
  log: AuditLogEntry[];
  onAddShow?: () => void;
  onReviewBookings?: () => void;
  onOpenAuditLog?: () => void;
  onViewAllShows?: () => void;
  onEditShow?: (show: AppShow) => void;
  onViewDiscord?: (show: AppShow) => void;
};

export function DashboardOverview({ shows, bookings, log, onAddShow, onReviewBookings, onOpenAuditLog, onViewAllShows, onEditShow, onViewDiscord }: DashboardOverviewProps) {
  const upcoming = shows.filter((s) => s.status === ShowStatus.CONFIRMED).sort((a,b) => a.date.localeCompare(b.date));
  const pending = bookings.filter((b) => b.status === SubmissionStatus.PENDING);
  return <div className="app-dashboard-overview" {...appPart('dashboard-overview')}><DashboardMobileHeader/><DashboardMobileCopy/><DashboardHero show={upcoming[0]} onEditShow={onEditShow} onViewDiscord={onViewDiscord}/><DashboardMetricsGrid upcomingCount={upcoming.length} pendingCount={pending.length}/><div className="app-dashboard-mobile-attention"><DashboardAttentionPanel variant="mobile"/></div><div className="app-dashboard-columns"><DashboardUpcomingPanel shows={upcoming} onViewAll={onViewAllShows}/><div className="app-dashboard-side"><div className="app-dashboard-desktop-quick"><DashboardQuickActionsPanel pendingCount={pending.length} onAddShow={onAddShow} onReviewBookings={onReviewBookings} onOpenAuditLog={onOpenAuditLog}/></div><DashboardActivityPanel log={log}/></div></div></div>;
}
