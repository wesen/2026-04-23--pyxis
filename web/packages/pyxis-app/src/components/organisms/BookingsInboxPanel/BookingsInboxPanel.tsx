import type { BookingRequest } from 'pyxis-types';
import { BookingCard } from '../../molecules/BookingCard';
import { Panel } from '../Panels';
import './BookingsInboxPanel.css';

export function BookingsInboxPanel({ bookings }: { bookings: BookingRequest[] }) {
  const pending = bookings.filter((booking) => booking.status === 'pending');
  return (
    <Panel title={`Awaiting review · ${pending.length}`} kicker="Review each request, then approve to add the show or decline with a reason." section="bookings-queue">
      <div className="app-card-list">{pending.map((booking)=><BookingCard key={booking.id} booking={booking}/>)}</div>
    </Panel>
  );
}
