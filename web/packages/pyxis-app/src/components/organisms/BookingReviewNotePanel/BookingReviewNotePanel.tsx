import { useEffect, useState } from 'react';
import type { BookingReview, Submission } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel } from '../Panels';
import './BookingReviewNotePanel.css';

export type BookingReviewNotePanelProps = {
  booking: Submission;
  review?: BookingReview;
  isSaving?: boolean;
  onSaveReview?: (note: string) => void;
};

const defaultFallbackNote = "Hi! Touring the east coast in June, would love to play Pyxis. Happy to work with any lineup you'd suggest.";

export function BookingReviewNotePanel({ booking, review, isSaving, onSaveReview }: BookingReviewNotePanelProps) {
  const [note, setNote] = useState(review?.note ?? '');

  useEffect(() => {
    setNote(review?.note ?? '');
  }, [review?.note]);

  return (
    <Panel title="Artist note & staff review" section="booking-review-note">
      <p className="app-muted-copy">{booking.message || defaultFallbackNote}</p>
      <label className="app-booking-review-note-field">
        <span>Internal review note</span>
        <textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add staff-only context for this booking…" />
      </label>
      <div className="app-booking-review-note-actions">
        {review?.updatedAt && <small>Last saved {review.updatedAt}</small>}
        <Button size="sm" variant="outline" onClick={() => onSaveReview?.(note)} isLoading={isSaving}>Save review note</Button>
      </div>
    </Panel>
  );
}
