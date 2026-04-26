import type { Meta, StoryObj } from '@storybook/react';
import { SubmissionStatus } from 'pyxis-types';
import { bookings } from '../../../api/mockData';
import { BookingCard, BookingQueueRow } from './BookingCard';

const meta = {
  title: 'Pyxis App/Components/Molecules/BookingCard',
  component: BookingCard,
  args: {
    booking: bookings[0],
  },
} satisfies Meta<typeof BookingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingCardDefault: Story = {
  render: (args) => <div style={{ width: 360, padding: 24 }}><BookingCard {...args} /></div>,
};

export const WithCallbacks: Story = {
  args: {
    onHold: (booking) => console.log('hold', booking.id),
    onDecline: (booking) => console.log('decline', booking.id),
    onApprove: (booking) => console.log('approve', booking.id),
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><BookingCard {...args} /></div>,
};

export const Approved: Story = {
  args: {
    booking: bookings.find((booking) => booking.status === SubmissionStatus.APPROVED) ?? bookings[0],
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><BookingCard {...args} /></div>,
};

export const Declined: Story = {
  args: {
    booking: bookings.find((booking) => booking.status === SubmissionStatus.DECLINED) ?? bookings[0],
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><BookingCard {...args} /></div>,
};

export const LongContent: Story = {
  args: {
    booking: {
      ...bookings[0],
      artistName: 'A Very Long Artist Name With Several Collaborators',
      genre: 'Experimental industrial noise and darkwave electronics',
      links: 'https://example.com/a-very-long-artist-link-for-review',
    },
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><BookingCard {...args} /></div>,
};

export const Narrow: Story = {
  render: () => <div style={{ width: 330, padding: 24 }}><BookingCard booking={bookings[0]} /></div>,
};

export const BookingList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 520, padding: 24 }}>
      {bookings.slice(0, 3).map((booking) => <BookingCard key={booking.id} booking={booking} />)}
    </div>
  ),
};

export const QueueRows: Story = {
  render: () => (
    <div style={{ width: 760, padding: 24 }}>
      <table className="app-table app-bookings-processed-table">
        <tbody>
          {bookings.map((booking) => <BookingQueueRow key={booking.id} booking={booking} />)}
        </tbody>
      </table>
    </div>
  ),
};
