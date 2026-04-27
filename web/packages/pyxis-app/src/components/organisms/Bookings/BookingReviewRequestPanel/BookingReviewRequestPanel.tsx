import { useEffect, useState } from 'react';
import type { Submission } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel } from '../Panels';
import './BookingReviewRequestPanel.css';

export type BookingDetailsDraft = Pick<Submission, 'artistName' | 'preferredDate' | 'genre' | 'expectedDraw' | 'links' | 'techRider' | 'message' | 'contactDiscord'>;

export type BookingReviewRequestPanelProps = {
  booking: Submission;
  preferredDateLabel?: string;
  isSaving?: boolean;
  onSaveDetails?: (draft: BookingDetailsDraft) => void;
};

export function BookingReviewRequestPanel({ booking, preferredDateLabel = 'Requested date', isSaving, onSaveDetails }: BookingReviewRequestPanelProps) {
  const [draft, setDraft] = useState<BookingDetailsDraft>(() => ({
    artistName: booking.artistName,
    preferredDate: booking.preferredDate,
    genre: booking.genre,
    expectedDraw: booking.expectedDraw,
    links: booking.links,
    techRider: booking.techRider,
    message: booking.message,
    contactDiscord: booking.contactDiscord,
  }));

  useEffect(() => {
    setDraft({
      artistName: booking.artistName,
      preferredDate: booking.preferredDate,
      genre: booking.genre,
      expectedDraw: booking.expectedDraw,
      links: booking.links,
      techRider: booking.techRider,
      message: booking.message,
      contactDiscord: booking.contactDiscord,
    });
  }, [booking]);

  const set = <K extends keyof BookingDetailsDraft>(key: K, value: BookingDetailsDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <Panel title="Request" section="booking-review-request">
      <div className="app-booking-request-form">
        <label><span>Artist / act</span><input value={draft.artistName} onChange={(event) => set('artistName', event.target.value)} /></label>
        <label><span>{preferredDateLabel}</span><input type="date" value={draft.preferredDate} onChange={(event) => set('preferredDate', event.target.value)} /></label>
        <label><span>Genre</span><input value={draft.genre} onChange={(event) => set('genre', event.target.value)} /></label>
        <label><span>Expected draw</span><input type="number" value={draft.expectedDraw || 0} onChange={(event) => set('expectedDraw', Number(event.target.value))} /></label>
        <label><span>Discord/contact</span><input value={draft.contactDiscord} onChange={(event) => set('contactDiscord', event.target.value)} /></label>
        <label><span>Links</span><input value={draft.links} onChange={(event) => set('links', event.target.value)} /></label>
        <label><span>Tech rider</span><textarea rows={3} value={draft.techRider} onChange={(event) => set('techRider', event.target.value)} /></label>
        <label><span>Artist message</span><textarea rows={4} value={draft.message} onChange={(event) => set('message', event.target.value)} /></label>
      </div>
      <div className="app-booking-request-actions">
        <Button size="sm" variant="outline" onClick={() => onSaveDetails?.(draft)} isLoading={isSaving}>Save booking details</Button>
      </div>
    </Panel>
  );
}
