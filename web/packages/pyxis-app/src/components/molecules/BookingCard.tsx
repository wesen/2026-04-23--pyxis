import type { BookingRequest } from 'pyxis-types';
import { Button, Icon } from 'pyxis-components';
import { StatusPill } from '../atoms/StatusPill';
import { appPart } from '../parts';
import '../atoms/StatusPill.css';
import './Rows.css';

function formatBookingDate(date: string, format: 'full' | 'short' = 'full') {
  const value = new Date(`${date}T00:00:00`);
  return value.toLocaleDateString('en-US', format === 'full'
    ? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric' });
}

function statusLabel(status: BookingRequest['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function BookingCard({ booking }: { booking: BookingRequest }) {
  return (
    <article className="app-booking-card" data-status={booking.status} {...appPart('booking-card')}>
      <div className="app-booking-card-main">
        <div className="app-booking-card-copy">
          <header>
            <h3>{booking.artist}</h3>
            <StatusPill tone={booking.status}>{statusLabel(booking.status)}</StatusPill>
          </header>
          <div className="app-booking-meta-row">
            <span><Icon name="calendar" size={12}/>{formatBookingDate(booking.date)}</span>
            <span><Icon name="music" size={12}/>{booking.genre}</span>
            <span><Icon name="users" size={12}/>~{booking.draw} est. draw</span>
            <span><Icon name="external" size={12}/><a>{booking.links}</a></span>
          </div>
          <div className="app-booking-submitted-row"><span>Submitted {booking.submitted}</span><span>·</span><span>Date is available</span></div>
        </div>
        {booking.status === 'pending' && <div className="app-booking-card-actions"><Button variant="ghost" size="sm">Hold</Button><Button variant="danger" size="sm" iconLeft="x">Decline</Button><Button variant="success" size="sm" iconLeft="check">Approve</Button></div>}
      </div>
    </article>
  );
}

export function BookingQueueRow({ booking }: { booking: BookingRequest }) {
  return <tr className="app-table-row app-booking-queue-row" {...appPart('booking-queue-row')}><td><strong>{booking.artist}</strong></td><td>{formatBookingDate(booking.date, 'short')}</td><td>{booking.genre}</td><td>{booking.submitted}</td><td><StatusPill tone={booking.status}>{statusLabel(booking.status)}</StatusPill></td></tr>;
}
