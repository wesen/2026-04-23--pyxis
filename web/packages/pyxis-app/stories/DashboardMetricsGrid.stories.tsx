import type { Meta, StoryObj } from '@storybook/react';
import { bookings, shows } from '../src/api/mockData';
import { DashboardMetricsGrid } from '../src/components/organisms/DashboardSections';

const confirmedShows = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const pendingBookings = bookings.filter((booking) => booking.status === 'pending');

const meta: Meta<typeof DashboardMetricsGrid> = {
  title: 'Pyxis App/Organisms/DashboardMetricsGrid',
  component: DashboardMetricsGrid,
  parameters: { layout: 'fullscreen' },
  args: {
    upcomingCount: confirmedShows.length,
    pendingCount: pendingBookings.length,
  },
};

export default meta;
type Story = StoryObj<typeof DashboardMetricsGrid>;

export const Desktop: Story = {
  render: (args) => (
    <div style={{ padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardMetricsGrid {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { variant: 'mobile' },
  render: (args) => (
    <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}>
      <DashboardMetricsGrid {...args} />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Busy: Story = {
  args: { upcomingCount: 12, pendingCount: 9 },
  render: (args) => (
    <div style={{ padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardMetricsGrid {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { upcomingCount: 0, pendingCount: 0 },
  render: (args) => (
    <div style={{ padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardMetricsGrid {...args} />
    </div>
  ),
};
