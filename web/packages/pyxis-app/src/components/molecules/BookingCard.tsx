import type { BookingRequest } from 'pyxis-types';
import { StatusDot } from '../atoms/StatusDot';
import { appPart } from '../parts';
import './Rows.css';
export function BookingCard({ booking }: { booking: BookingRequest }) { return <article className="app-booking-card" data-status={booking.status} {...appPart('booking-card')}><header><h3>{booking.artist}</h3><span><StatusDot tone={booking.status} />{booking.status}</span></header><p>{booking.genre} · requested {booking.date} · est. {booking.draw}</p><small>{booking.links} · submitted {booking.submitted}</small></article>; }
export function BookingQueueRow({ booking }: { booking: BookingRequest }) { return <tr className="app-table-row" {...appPart('booking-queue-row')}><td><strong>{booking.artist}</strong><span>{booking.links}</span></td><td>{booking.date}</td><td>{booking.genre}</td><td>{booking.draw}</td><td>{booking.submitted}</td><td><span className="app-row-status"><StatusDot tone={booking.status} />{booking.status}</span></td></tr>; }
