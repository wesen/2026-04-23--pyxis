import type { Submission } from 'pyxis-types';
import { SubmissionStatus } from 'pyxis-types';
import { BookingQueueRow } from '../../../molecules/BookingCard';
import { Panel } from '../../Panels';
import './BookingsProcessedPanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type BookingsProcessedPanelProps = {
  bookings: Submission[];
};

export function BookingsProcessedPanel({ bookings }: BookingsProcessedPanelProps) {
  const processed = bookings.filter((booking) => booking.status !== SubmissionStatus.PENDING);
  return <Panel title="Recently processed" action={<button className="app-panel-link-action">View archive</button>} section="bookings-processed">{processed.length > 0 ? <div className="app-table-wrap"><table className="app-table app-bookings-processed-table"><thead><tr><th>Artist</th><th>Requested</th><th>Genre</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{processed.map((booking)=><BookingQueueRow key={booking.id} booking={booking}/>)}</tbody></table></div> : <AppEmptyState title="No processed booking requests yet." />}</Panel>;
}
