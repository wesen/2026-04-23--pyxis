import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../../api/mockData';
import { BookingQueue } from './BookingQueue';

const meta = {
  title: 'Pyxis App/Components/Organisms/Bookings/BookingQueue',
  component: BookingQueue,
  parameters: { layout: 'fullscreen' },
  args: { bookings },
} satisfies Meta<typeof BookingQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><BookingQueue {...args} /></div>,
};

export const Mobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingQueue {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const WithCallbacks: Story = {
  args: {
    onHold: (booking) => console.log('hold', booking.id),
    onDecline: (booking) => console.log('decline', booking.id),
    onApprove: (booking) => console.log('approve', booking.id),
  },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingQueue {...args} /></div>,
};

export const Empty: Story = {
  args: { bookings: [] },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><BookingQueue {...args} /></div>,
};
