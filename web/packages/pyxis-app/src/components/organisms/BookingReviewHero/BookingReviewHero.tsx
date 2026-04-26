import type { BookingRequest } from 'pyxis-types';
import { StatusDot } from '../../atoms/StatusDot';
import './BookingReviewHero.css';

export type BookingReviewHeroProps = {
  booking: BookingRequest;
};

export function BookingReviewHero({ booking }: BookingReviewHeroProps) {
  return (
    <section className="app-detail-hero app-booking-review-hero" data-section="booking-review-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={booking.status}/>{booking.status}</span>
        <h1>{booking.artist}</h1>
        <p>Submitted {booking.submitted} · {booking.genre}</p>
      </div>
    </section>
  );
}
