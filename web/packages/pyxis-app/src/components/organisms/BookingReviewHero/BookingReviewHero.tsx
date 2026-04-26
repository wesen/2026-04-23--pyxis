import { Submission, SubmissionStatus } from 'pyxis-types';
import type { StatusTone } from '../../atoms/StatusDot';
import { StatusDot } from '../../atoms/StatusDot';
import './BookingReviewHero.css';

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

export type BookingReviewHeroProps = {
  booking: Submission;
};

export function BookingReviewHero({ booking }: BookingReviewHeroProps) {
  return (
    <section className="app-detail-hero app-booking-review-hero" data-section="booking-review-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={submissionStatusString(booking.status).toLowerCase() as StatusTone}/>{submissionStatusString(booking.status)}</span>
        <h1>{booking.artistName}</h1>
        <p>Submitted {booking.createdAt} · {booking.genre}</p>
      </div>
    </section>
  );
}
