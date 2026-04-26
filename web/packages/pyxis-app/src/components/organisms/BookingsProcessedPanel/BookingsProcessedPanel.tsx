import type { BookingRequest } from 'pyxis-types';
import { BookingQueueRow } from '../../molecules/BookingCard';
import { Panel } from '../Panels';
import './BookingsProcessedPanel.css';

export function BookingsProcessedPanel({ bookings }: { bookings: BookingRequest[] }) {
  const processed = bookings.filter((booking) => booking.status !== 'pending');
  return <Panel title="Recently processed" action={<button className="app-panel-link-action">View archive</button>} section="bookings-processed"><div className="app-table-wrap"><table className="app-table app-bookings-processed-table"><thead><tr><th>Artist</th><th>Requested</th><th>Genre</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{processed.map((booking)=><BookingQueueRow key={booking.id} booking={booking}/>)}</tbody></table></div></Panel>;
}
