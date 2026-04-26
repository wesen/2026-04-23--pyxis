import type { Meta, StoryObj } from '@storybook/react';
import { auditLog, bookings, shows } from '../src/api/mockData';
import { ActivityFeedItem } from '../src/components/molecules/ActivityFeedItem';
import { MetricCard } from '../src/components/molecules/MetricCard';
import {
  DashboardAttentionContent,
  DashboardAttentionCount,
  DashboardHero,
  DashboardMobileCopy,
  DashboardMobileHeader,
} from '../src/components/organisms/DashboardSections';
import { DashboardQuickActionsPanel, DashboardUpcomingPanel, Panel } from '../src/components/organisms/Panels';

const meta: Meta = {
  title: 'Pyxis App/Dashboard Sections',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const pendingBookings = bookings.filter((booking) => booking.status === 'pending');

export const HeroDesktop: Story = {
  render: () => <div style={{ padding: 24, background: 'var(--app-canvas)' }}><DashboardHero show={confirmedShows[0]} /></div>,
};

export const MobileHeaderAndCopy: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileHeader /><DashboardMobileCopy /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const MetricsGridDesktop: Story = {
  render: () => (
    <div style={{ padding: 24, background: 'var(--app-canvas)' }}>
      <div className="app-metrics-grid" data-section="dashboard-metrics">
        <MetricCard label="Upcoming" value={confirmedShows.length} caption="Next 60 days" tone="accent" />
        <MetricCard label="Pending bookings" value={pendingBookings.length} caption="Awaiting review" trend="2 new today" tone="warning" />
        <MetricCard label="Avg draw" value="84" caption="Last 6 shows" trend="↑ 12 vs. prior 6" tone="success" />
        <MetricCard label="Capacity use" value="56%" caption="May 2025" tone="info" />
      </div>
    </div>
  ),
};

export const UpcomingPanelDesktop: Story = {
  render: () => <div style={{ width: 640, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel shows={confirmedShows} /></div>,
};

export const UpcomingPanelMobileCards: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardUpcomingPanel shows={confirmedShows} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const UpcomingPanelLongArtistNames: Story = {
  render: () => <div style={{ width: 640, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel shows={confirmedShows.map((show, index) => index === 1 ? { ...show, artist: 'Moor Mother with Special Guests and Ensemble' } : show)} /></div>,
};

export const UpcomingPanelEmpty: Story = {
  render: () => <div style={{ width: 640, padding: 24, background: 'var(--app-canvas)' }}><DashboardUpcomingPanel shows={[]} /></div>,
};

export const QuickActionsPanel: Story = {
  render: () => <div style={{ width: 360, padding: 24, background: 'var(--app-canvas)' }}><DashboardQuickActionsPanel pendingCount={pendingBookings.length} /></div>,
};

export const QuickActionsPanelNoPending: Story = {
  render: () => <div style={{ width: 360, padding: 24, background: 'var(--app-canvas)' }}><DashboardQuickActionsPanel pendingCount={0} /></div>,
};

export const AttentionPanelMobile: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><Panel title="Needs your attention" action={<DashboardAttentionCount />} section="dashboard-attention"><DashboardAttentionContent /></Panel></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const ActivityPanel: Story = {
  render: () => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><Panel title="Recent activity" action={<span className="app-live-label">live</span>} section="dashboard-activity"><ul className="app-feed">{auditLog.slice(0, 5).map((item) => <ActivityFeedItem key={item.id} item={item} />)}</ul></Panel></div>,
};

export const MobileDashboardStack: Story = {
  render: () => (
    <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}>
      <DashboardMobileHeader />
      <DashboardMobileCopy />
      <DashboardHero show={confirmedShows[0]} />
      <div className="app-metrics-grid" data-section="dashboard-metrics">
        <MetricCard label="Upcoming" value={confirmedShows.length} caption="Next 60 days" tone="accent" />
        <MetricCard label="Pending bookings" value={pendingBookings.length} caption="Awaiting review" trend="2 new today" tone="warning" />
        <MetricCard label="Avg draw" value="84" caption="Last 6 shows" trend="↑ 12 vs. prior 6" tone="success" />
        <MetricCard label="Capacity use" value="56%" caption="May 2025" tone="info" />
      </div>
      <div style={{ marginTop: 20 }}><Panel title="Needs your attention" action={<DashboardAttentionCount />} section="dashboard-attention"><DashboardAttentionContent /></Panel></div>
      <div style={{ marginTop: 20 }}><Panel title="Recent activity" action={<span className="app-live-label">live</span>} section="dashboard-activity"><ul className="app-feed">{auditLog.slice(0, 3).map((item) => <ActivityFeedItem key={item.id} item={item} />)}</ul></Panel></div>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
