import type { BookingRequest } from 'pyxis-types';
import { BookingCard, BookingQueueRow } from '../../molecules/BookingCard';
import { appPart } from '../../parts';
import '../../molecules/Table/Table.css';
import '../../molecules/BookingCard/BookingCard.css';
import './BookingQueue.css';
export function BookingQueue({ bookings }: { bookings: BookingRequest[] }) { return <div {...appPart('booking-queue')}><div className="app-card-list app-mobile-only">{bookings.map((booking)=><BookingCard key={booking.id} booking={booking}/>)}</div><div className="app-table-wrap app-desktop-only"><table className="app-table app-bookings-processed-table"><thead><tr><th>Artist</th><th>Requested</th><th>Genre</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{bookings.map((booking)=><BookingQueueRow key={booking.id} booking={booking}/>)}</tbody></table></div></div>; }
