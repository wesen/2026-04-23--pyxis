import type { Submission } from 'pyxis-types';
import type { StatusTone } from '../../atoms/StatusDot';
import { StatusDot } from '../../atoms/StatusDot';
import './BookingReviewHero.css';

export type BookingReviewHeroProps = {
  booking: Submission;
};

export function BookingReviewHero({ booking }: BookingReviewHeroProps) {
  return (
    <section className="app-detail-hero app-booking-review-hero" data-section="booking-review-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={booking.status as StatusTone}/>{booking.status}</span>
        <h1>{booking.artistName}</h1>
        <p>Submitted {booking.createdAt} · {booking.genre}</p>
      </div>
    </section>
  );
}
