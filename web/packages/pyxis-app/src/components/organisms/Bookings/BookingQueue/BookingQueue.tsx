import type { Submission } from 'pyxis-types';
import { BookingCard, type BookingActionHandler } from '../../../molecules/BookingCard';
import { BookingQueueRow } from '../../../molecules/BookingQueueRow';
import { appPart } from '../../../parts';
import './BookingQueue.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type BookingQueueProps = {
  bookings: Submission[];
  onHold?: BookingActionHandler;
  onDecline?: BookingActionHandler;
  onApprove?: BookingActionHandler;
};

export function BookingQueue({ bookings, onHold, onDecline, onApprove }: BookingQueueProps) {
  return <div {...appPart('booking-queue')}>{bookings.length > 0 ? <><div className="app-card-list app-mobile-only">{bookings.map((booking)=><BookingCard key={booking.id} booking={booking} onHold={onHold} onDecline={onDecline} onApprove={onApprove}/>)}</div><div className="app-table-wrap app-desktop-only"><table className="app-table app-bookings-processed-table"><thead><tr><th>Artist</th><th>Requested</th><th>Genre</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{bookings.map((booking)=><BookingQueueRow key={booking.id} booking={booking}/>)}</tbody></table></div></> : <AppEmptyState title="No booking requests yet." />}</div>;
}
