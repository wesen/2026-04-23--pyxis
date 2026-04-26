import type { Meta, StoryObj } from '@storybook/react';
import { auditLog, bookings, shows } from '../../../api/mockData';
import { DashboardActivityPanel } from '../DashboardActivityPanel';
import { DashboardAttentionPanel } from '../DashboardAttentionPanel';
import { DashboardHero } from '../DashboardHero';
import { DashboardMetricsGrid } from '../DashboardMetricsGrid';
import { DashboardMobileCopy } from '../DashboardMobileCopy';
import { DashboardMobileHeader } from '../DashboardMobileHeader';
import { DashboardOverview } from './DashboardOverview';

const meta: Meta = {
  title: 'Pyxis App/Components/Organisms/DashboardOverview',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const pendingBookings = bookings.filter((booking) => booking.status === 'pending');

export const Default: Story = {
  render: () => <div style={{ padding: 24 }}><DashboardOverview shows={shows} bookings={bookings} log={auditLog}/></div>,
};

export const MobileHeaderAndCopy: Story = {
  render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileHeader /><DashboardMobileCopy /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
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
