import type { BookingRequest } from 'pyxis-types';
import { Panel } from '../Panels';
import './BookingReviewNotePanel.css';

export function BookingReviewNotePanel({ booking }: { booking: BookingRequest }) {
  return <Panel title="Artist note" section="booking-review-note"><p className="app-muted-copy">{booking.notes ?? "Hi! Touring the east coast in June, would love to play Pyxis. Happy to work with any lineup you'd suggest."}</p></Panel>;
}
