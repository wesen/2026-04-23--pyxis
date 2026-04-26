import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { DashboardQuickActionsPanel } from '.';

const pendingCount = bookings.filter((booking) => booking.status === 'pending').length;

const meta: Meta<typeof DashboardQuickActionsPanel> = {
  title: 'Pyxis App/Organisms/DashboardQuickActionsPanel',
  component: DashboardQuickActionsPanel,
  parameters: { layout: 'fullscreen' },
  args: { pendingCount },
};

export default meta;
type Story = StoryObj<typeof DashboardQuickActionsPanel>;

export const Default: Story = {
  render: (args) => <div style={{ width: 360, padding: 24, background: 'var(--app-canvas)' }}><DashboardQuickActionsPanel {...args} /></div>,
};

export const NoPendingBookings: Story = {
  args: { pendingCount: 0 },
  render: (args) => <div style={{ width: 360, padding: 24, background: 'var(--app-canvas)' }}><DashboardQuickActionsPanel {...args} /></div>,
};

export const Narrow: Story = {
  render: (args) => <div style={{ width: 320, padding: 14, background: 'var(--app-canvas)' }}><DashboardQuickActionsPanel {...args} /></div>,
};
