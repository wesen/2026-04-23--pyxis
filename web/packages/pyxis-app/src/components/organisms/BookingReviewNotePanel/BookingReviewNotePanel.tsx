import type { BookingRequest } from 'pyxis-types';
import { Panel } from '../Panels';
import './BookingReviewNotePanel.css';

export type BookingReviewNotePanelProps = {
  booking: BookingRequest;
  fallbackNote?: string;
};

const defaultFallbackNote = "Hi! Touring the east coast in June, would love to play Pyxis. Happy to work with any lineup you'd suggest.";

export function BookingReviewNotePanel({ booking, fallbackNote = defaultFallbackNote }: BookingReviewNotePanelProps) {
  return <Panel title="Artist note" section="booking-review-note"><p className="app-muted-copy">{booking.notes ?? fallbackNote}</p></Panel>;
}
