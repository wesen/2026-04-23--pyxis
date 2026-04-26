import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingsProcessedPanel } from './BookingsProcessedPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingsProcessedPanel',
  component: BookingsProcessedPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    bookings,
  },
} satisfies Meta<typeof BookingsProcessedPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProcessedPanel: Story = {
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsProcessedPanel {...args} /></div>,
};

export const Empty: Story = {
  args: {
    bookings: bookings.filter((booking) => booking.status === 'pending'),
  },
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsProcessedPanel {...args} /></div>,
};

export const Dense: Story = {
  args: {
    bookings: [...bookings, ...bookings.filter((booking) => booking.status !== 'pending').map((booking) => ({ ...booking, id: booking.id + 200, artist: `${booking.artist} archived` }))],
  },
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsProcessedPanel {...args} /></div>,
};
