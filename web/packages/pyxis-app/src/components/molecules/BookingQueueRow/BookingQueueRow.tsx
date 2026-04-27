import type { Submission } from 'pyxis-types';
import { StatusPill } from '../../atoms/StatusPill';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './BookingQueueRow.css';

function formatBookingDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type BookingQueueRowProps = {
  booking: Submission;
};

export function BookingQueueRow({ booking }: BookingQueueRowProps) {
  return <tr className="app-table-row app-booking-queue-row" {...appPart('booking-queue-row')}><td><strong>{booking.artistName}</strong></td><td>{formatBookingDate(booking.preferredDate)}</td><td>{booking.genre}</td><td>{booking.createdAt}</td><td><StatusPill status={booking.status} /></td></tr>;
}
