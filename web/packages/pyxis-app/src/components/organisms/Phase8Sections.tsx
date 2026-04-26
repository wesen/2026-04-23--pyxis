import type { AppShow, BookingRequest, CalendarEvent } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { StatusDot } from '../atoms/StatusDot';
import { BookingCard } from '../molecules/BookingCard';
import { CalendarEventChip } from '../molecules/CalendarEventChip';
import { BookingQueue, CalendarMonth, Panel } from './Panels';

export function ShowDetailHero({ show }: { show: AppShow }) {
  return (
    <section className="app-detail-hero" data-section="show-detail-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={show.status}/>{show.status}</span>
        <h1>{show.artist}</h1>
        <p>Fri, May 2, 2025 · Doors {show.doors} · {show.age}</p>
      </div>
      <div className="app-poster-placeholder">poster · 1080×1080</div>
    </section>
  );
}

export function ShowDetailInfoPanel({ show }: { show: AppShow }) {
  return (
    <Panel title="Details" section="show-detail-info">
      <div className="app-detail-list">
        <span>Doors <b>{show.doors}</b></span>
        <span>Price <b>{show.price}</b></span>
        <span>Expected draw <b>{show.draw} / {show.capacity}</b></span>
        <span>Genre <b>{show.genre}</b></span>
      </div>
    </Panel>
  );
}

export function ShowDetailDiscordPanel() {
  return (
    <Panel title="Posted to Discord" section="show-detail-discord">
      <p className="app-muted-copy">#upcoming-shows · Pinned · 4 days ago · 12 reactions</p>
      <Button variant="outline" iconLeft="external">Open post</Button>
    </Panel>
  );
}

export function CalendarBoard({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="app-calendar-layout" data-section="calendar-board">
      <Panel title="May 2025" action={<Button variant="outline" size="sm">Today</Button>} section="calendar-month">
        <CalendarMonth events={events}/>
      </Panel>
      <CalendarAgenda events={events}/>
    </div>
  );
}

export function CalendarAgenda({ events }: { events: CalendarEvent[] }) {
  return (
    <aside className="app-calendar-side" data-section="calendar-agenda">
      <Panel title="May at a glance">
        <div className="app-detail-list">
          <span>Confirmed <b>5</b></span>
          <span>Hold <b>1</b></span>
          <span>Blocked <b>1</b></span>
          <span>Open nights <b>24</b></span>
        </div>
      </Panel>
      <Panel title="This week">
        <div className="app-stack">{events.slice(0,3).map((event)=><CalendarEventChip key={event.date+event.label} event={event}/>)}</div>
      </Panel>
    </aside>
  );
}

export function BookingsInboxPanel({ bookings }: { bookings: BookingRequest[] }) {
  const pending = bookings.filter((booking) => booking.status === 'pending');
  return (
    <Panel title={`Awaiting review · ${pending.length}`} kicker="Review each request, then approve to add the show or decline with a reason." section="bookings-queue">
      <div className="app-card-list">{pending.map((booking)=><BookingCard key={booking.id} booking={booking}/>)}</div>
    </Panel>
  );
}

export function BookingsProcessedPanel({ bookings }: { bookings: BookingRequest[] }) {
  const processed = bookings.filter((booking) => booking.status !== 'pending');
  return <Panel title="Recently processed" section="bookings-processed"><BookingQueue bookings={processed}/></Panel>;
}

export function BookingsInsightsPanel() {
  return (
    <aside className="app-bookings-side" data-section="bookings-insights">
      <Panel title="Inbox rhythm">
        <div className="app-mini-bars">{[2,4,1,3,5,2,6,3,4,7,5,3].map((v,i)=><span key={i} style={{ height: `${v*10}px` }} data-hot={i===9}/>)}</div>
        <p className="app-muted-copy">Submissions, last 12 weeks · avg response 2.1 days.</p>
      </Panel>
      <Panel title="Decline templates">
        <div className="app-template-list">{['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info'].map((template)=><button key={template}>{template} ›</button>)}</div>
      </Panel>
    </aside>
  );
}

export function BookingReviewHero({ booking }: { booking: BookingRequest }) {
  return (
    <section className="app-detail-hero app-booking-review-hero" data-section="booking-review-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={booking.status}/>{booking.status}</span>
        <h1>{booking.artist}</h1>
        <p>Submitted {booking.submitted} · {booking.genre}</p>
      </div>
    </section>
  );
}

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

export function BookingReviewDatePanel() {
  return (
    <Panel title="Date check" section="booking-review-date">
      <p className="app-success-note">✓ Date is available</p>
      <p className="app-muted-copy">Jun 14 is an open night. Nearest show: Zola Jesus on Jun 6.</p>
    </Panel>
  );
}

export function BookingReviewNotePanel({ booking }: { booking: BookingRequest }) {
  return <Panel title="Artist note" section="booking-review-note"><p className="app-muted-copy">{booking.notes ?? "Hi! Touring the east coast in June, would love to play Pyxis. Happy to work with any lineup you'd suggest."}</p></Panel>;
}
