import type { BookingRequest } from 'pyxis-types';
import { Panel } from '../Panels';
import './BookingReviewRequestPanel.css';

export function BookingReviewRequestPanel({ booking }: { booking: BookingRequest }) {
  return (
    <Panel title="Request" section="booking-review-request">
      <div className="app-detail-list">
        <span>Preferred date <b>Sat, Jun 14</b></span>
        <span>Expected draw <b>~{booking.draw}</b></span>
        <span>Links <b>{booking.links}</b></span>
      </div>
    </Panel>
  );
}
