import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingsInboxPanel } from './BookingsInboxPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingsInboxPanel',
  component: BookingsInboxPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    bookings,
  },
} satisfies Meta<typeof BookingsInboxPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InboxPanel: Story = {
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel {...args} /></div>,
};

export const WithCallbacks: Story = {
  args: {
    onHold: (booking) => console.log('hold', booking.id),
    onDecline: (booking) => console.log('decline', booking.id),
    onApprove: (booking) => console.log('approve', booking.id),
  },
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel {...args} /></div>,
};

export const InboxEmpty: Story = {
  args: {
    bookings: bookings.filter((booking) => booking.status !== 'pending'),
  },
  render: (args) => <div style={{ width: 720, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel {...args} /></div>,
};

export const Narrow: Story = {
  render: (args) => <div style={{ width: 360, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel {...args} /></div>,
};

export const Dense: Story = {
  args: {
    bookings: [...bookings, ...bookings.filter((booking) => booking.status === 'pending').map((booking) => ({ ...booking, id: booking.id + 100, artist: `${booking.artist} II` }))],
  },
  render: (args) => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel {...args} /></div>,
};
