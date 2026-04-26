import type { Meta, StoryObj } from '@storybook/react';
import { auditLog, bookings, shows } from '../../../api/mockData';
import {
  DashboardHero,
  DashboardMetricsGrid,
  DashboardMobileCopy,
  DashboardMobileHeader,
} from '../DashboardSections';
import { DashboardActivityPanel, DashboardAttentionPanel, DashboardQuickActionsPanel, DashboardUpcomingPanel } from '../Panels';
import { AppSidebar, AppTopBar, AppMobileBottomNav } from '../../shell/AppShell';

const meta: Meta = {
  title: 'Pyxis App/Components/Organisms/DashboardOverview/DashboardSections',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const pendingBookings = bookings.filter((booking) => booking.status === 'pending');

export const HeroDesktop: Story = {
  render: () => <div style={{ padding: 24, background: 'var(--app-canvas)' }}><DashboardHero show={confirmedShows[0]} /></div>,
};

export const AppSidebarMenu: Story = {
  render: () => <div style={{ width: 220, height: 760 }}><AppSidebar /></div>,
};

export const AppTopBarDashboard: Story = {
  render: () => <div style={{ width: 1020 }}><AppTopBar title="Welcome back, Ada" eyebrow="Home / Dashboard" subtitle="Wednesday, April 23 · 6 shows booked this month" /></div>,
};

export const AppMobileBottomNavigation: Story = {
  render: () => <div style={{ width: 390, paddingTop: 700, background: 'var(--app-mobile-canvas)' }}><AppMobileBottomNav /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const MobileHeaderAndCopy: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileHeader /><DashboardMobileCopy /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const MetricsGridDesktop: Story = {
  render: () => (
    <div style={{ padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardMetricsGrid upcomingCount={confirmedShows.length} pendingCount={pendingBookings.length} />
    </div>
  ),
};

export const MetricsGridMobile: Story = {
  render: () => (
    <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}>
      <DashboardMetricsGrid upcomingCount={confirmedShows.length} pendingCount={pendingBookings.length} variant="mobile" />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
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

export const AttentionPanel: Story = {
  render: () => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><DashboardAttentionPanel /></div>,
};

export const AttentionPanelMobile: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardAttentionPanel variant="mobile" /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const ActivityPanel: Story = {
  render: () => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><DashboardActivityPanel log={auditLog} /></div>,
};

export const ActivityPanelMobile: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardActivityPanel log={auditLog} limit={3} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const ActivityPanelEmpty: Story = {
  render: () => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><DashboardActivityPanel log={[]} /></div>,
};

export const MobileDashboardStack: Story = {
  render: () => (
    <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}>
      <DashboardMobileHeader />
      <DashboardMobileCopy />
      <DashboardHero show={confirmedShows[0]} />
      <DashboardMetricsGrid upcomingCount={confirmedShows.length} pendingCount={pendingBookings.length} variant="mobile" />
      <div style={{ marginTop: 20 }}><DashboardAttentionPanel variant="mobile" /></div>
      <div style={{ marginTop: 20 }}><DashboardActivityPanel log={auditLog} limit={3} /></div>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
