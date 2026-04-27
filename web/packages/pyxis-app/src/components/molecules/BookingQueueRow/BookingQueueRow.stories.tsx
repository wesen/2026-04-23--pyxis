import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingQueueRow } from '.';

const meta = {
  title: 'Pyxis App/Components/Molecules/BookingQueueRow',
  component: BookingQueueRow,
  args: {
    booking: bookings[0],
  },
} satisfies Meta<typeof BookingQueueRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 760, padding: 24 }}>
      <table className="app-table app-bookings-processed-table">
        <tbody>
          <BookingQueueRow {...args} />
        </tbody>
      </table>
    </div>
  ),
};

export const RowSet: Story = {
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
