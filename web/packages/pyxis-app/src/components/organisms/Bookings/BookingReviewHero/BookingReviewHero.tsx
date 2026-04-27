import { Submission } from 'pyxis-types';
import { StatusDot, statusToLabel } from '../../atoms/StatusDot';
import './BookingReviewHero.css';

export type BookingReviewHeroProps = {
  booking: Submission;
};

export function BookingReviewHero({ booking }: BookingReviewHeroProps) {
  return (
    <section className="app-detail-hero app-booking-review-hero" data-section="booking-review-hero">
      <div>
        <span className="app-row-status"><StatusDot status={booking.status} />{statusToLabel(booking.status)}</span>
        <h1>{booking.artistName}</h1>
        <p>Submitted {booking.createdAt} · {booking.genre}</p>
      </div>
    </section>
  );
}
