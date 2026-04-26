import type { BookingRequest } from 'pyxis-types';
import { Panel } from '../Panels';
import './BookingReviewRequestPanel.css';

export type BookingReviewRequestPanelProps = {
  booking: BookingRequest;
  preferredDateLabel?: string;
};

export function BookingReviewRequestPanel({ booking, preferredDateLabel = 'Sat, Jun 14' }: BookingReviewRequestPanelProps) {
  return (
    <Panel title="Request" section="booking-review-request">
      <div className="app-detail-list">
        <span>Preferred date <b>{preferredDateLabel}</b></span>
        <span>Expected draw <b>~{booking.draw}</b></span>
        <span>Links <b>{booking.links}</b></span>
      </div>
    </Panel>
  );
}
