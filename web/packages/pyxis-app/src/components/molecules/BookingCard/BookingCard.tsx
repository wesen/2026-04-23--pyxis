import { Submission, SubmissionStatus } from 'pyxis-types';
import { Button, Icon } from 'pyxis-components';
import { StatusPill } from '../../atoms/StatusPill';
import type { StatusTone } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './BookingCard.css';

function formatBookingDate(date: string, format: 'full' | 'short' = 'full') {
  const value = new Date(`${date}T00:00:00`);
  return value.toLocaleDateString('en-US', format === 'full'
    ? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric' });
}

function submissionStatusString(status: SubmissionStatus): string {
  const map: Record<SubmissionStatus, string> = {
    [SubmissionStatus.UNSPECIFIED]: 'Unspecified',
    [SubmissionStatus.PENDING]: 'Pending',
    [SubmissionStatus.APPROVED]: 'Approved',
    [SubmissionStatus.DECLINED]: 'Declined',
    [SubmissionStatus.HOLD]: 'Hold',
    [SubmissionStatus.CANCELLED]: 'Cancelled',
  };
  return map[status] ?? 'Unknown';
}

export type BookingActionHandler = (booking: Submission) => void;

export type BookingCardProps = {
  booking: Submission;
  onHold?: BookingActionHandler;
  onDecline?: BookingActionHandler;
  onApprove?: BookingActionHandler;
};

export type BookingQueueRowProps = {
  booking: Submission;
};

export function BookingCard({ booking, onHold, onDecline, onApprove }: BookingCardProps) {
  return (
    <article className="app-booking-card" data-status={booking.status} {...appPart('booking-card')}>
      <div className="app-booking-card-main">
        <div className="app-booking-card-copy">
          <header>
            <h3>{booking.artistName}</h3>
            <StatusPill tone={submissionStatusString(booking.status).toLowerCase() as StatusTone}>{submissionStatusString(booking.status)}</StatusPill>
          </header>
          <div className="app-booking-meta-row">
            <span><Icon name="calendar" size={12}/>{formatBookingDate(booking.preferredDate)}</span>
            <span><Icon name="music" size={12}/>{booking.genre}</span>
            <span><Icon name="users" size={12}/>~{booking.expectedDraw} est. draw</span>
            <span><Icon name="external" size={12}/><a>{booking.links}</a></span>
          </div>
          <div className="app-booking-submitted-row"><span>Submitted {booking.createdAt}</span><span>·</span><span>Date is available</span></div>
        </div>
        {booking.status === SubmissionStatus.PENDING && <div className="app-booking-card-actions"><Button variant="ghost" size="sm" onClick={() => onHold?.(booking)}>Hold</Button><Button variant="danger" size="sm" iconLeft="x" onClick={() => onDecline?.(booking)}>Decline</Button><Button variant="success" size="sm" iconLeft="check" onClick={() => onApprove?.(booking)}>Approve</Button></div>}
      </div>
    </article>
  );
}

export function BookingQueueRow({ booking }: BookingQueueRowProps) {
  return <tr className="app-table-row app-booking-queue-row" {...appPart('booking-queue-row')}><td><strong>{booking.artistName}</strong></td><td>{formatBookingDate(booking.preferredDate, 'short')}</td><td>{booking.genre}</td><td>{booking.createdAt}</td><td><StatusPill tone={submissionStatusString(booking.status).toLowerCase() as StatusTone}>{submissionStatusString(booking.status)}</StatusPill></td></tr>;
}
