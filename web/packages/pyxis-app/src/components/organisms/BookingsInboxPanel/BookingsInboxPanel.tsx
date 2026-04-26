import type { Submission } from 'pyxis-types';
import { SubmissionStatus } from 'pyxis-types';
import { BookingCard, type BookingActionHandler } from '../../molecules/BookingCard';
import { Panel } from '../Panels';
import './BookingsInboxPanel.css';
import { AppEmptyState } from '../../molecules/AppEmptyState';

export type BookingsInboxPanelProps = {
  bookings: Submission[];
  onHold?: BookingActionHandler;
  onDecline?: BookingActionHandler;
  onApprove?: BookingActionHandler;
};

export function BookingsInboxPanel({ bookings, onHold, onDecline, onApprove }: BookingsInboxPanelProps) {
  const pending = bookings.filter((booking) => booking.status === SubmissionStatus.PENDING);
  return (
    <Panel title={`Awaiting review · ${pending.length}`} kicker="Review each request, then approve to add the show or decline with a reason." section="bookings-queue">
      {pending.length > 0 ? <div className="app-card-list">{pending.map((booking)=><BookingCard key={booking.id} booking={booking} onHold={onHold} onDecline={onDecline} onApprove={onApprove}/>)}</div> : <AppEmptyState title="No pending booking requests." />}
    </Panel>
  );
}
