import type { Meta, StoryObj } from '@storybook/react';
import { auditLog, bookings, shows } from '../../../api/mockData';
import { DashboardActivityPanel } from '../DashboardActivityPanel';
import { DashboardAttentionPanel } from '../DashboardAttentionPanel';
import { DashboardHero } from '../DashboardHero';
import { DashboardMetricsGrid } from '../DashboardMetricsGrid';
import { DashboardMobileCopy } from '../DashboardMobileCopy';
import { DashboardMobileHeader } from '../DashboardMobileHeader';
import { DashboardOverview } from './DashboardOverview';

const meta = {
  title: 'Pyxis App/Components/Organisms/DashboardOverview',
  component: DashboardOverview,
  parameters: { layout: 'fullscreen' },
  args: { shows, bookings, log: auditLog },
} satisfies Meta<typeof DashboardOverview>;
export default meta;

type Story = StoryObj<typeof meta>;

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const pendingBookings = bookings.filter((booking) => booking.status === 'pending');

export const Default: Story = {
  render: (args) => <div style={{ padding: 24 }}><DashboardOverview {...args}/></div>,
};

export const Empty: Story = {
  args: { shows: [], bookings: [], log: [] },
  render: (args) => <div style={{ padding: 24 }}><DashboardOverview {...args}/></div>,
};

export const Busy: Story = {
  args: { shows: [...shows, ...shows.map((show) => ({ ...show, id: show.id + 100, artist: `${show.artist} late set` }))], bookings: [...bookings, ...bookings.map((booking) => ({ ...booking, id: booking.id + 100, artistName: `${booking.artistName} follow-up` }))], log: [...auditLog, ...auditLog.map((item) => ({ ...item, id: item.id + 100 }))] },
  render: (args) => <div style={{ padding: 24 }}><DashboardOverview {...args}/></div>,
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
