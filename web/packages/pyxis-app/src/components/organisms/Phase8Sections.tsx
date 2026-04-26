import type { AppShow, BookingRequest, CalendarEvent } from 'pyxis-types';
import { shows as seedShows } from '../../api/mockData';
import { Button, Icon } from 'pyxis-components';
import { StatusDot } from '../atoms/StatusDot';
import { StatusPill } from '../atoms/StatusPill';
import { BookingCard, BookingQueueRow } from '../molecules/BookingCard';
import { CalendarEventChip } from '../molecules/CalendarEventChip';
import { Panel } from './Panels';
import './Phase8Sections.css';

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

function eventsOnDay(events: CalendarEvent[], day: number) {
  return events.filter((event) => new Date(`${event.date}T00:00:00`).getDate() === day);
}

export function CalendarMonthPanel({ events }: { events: CalendarEvent[] }) {
  const firstDay = new Date(2025, 4, 1).getDay();
  const cells: Array<number | null> = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: 31 }, (_, index) => index + 1)];
  return (
    <section className="app-panel app-calendar-month-panel" data-section="calendar-month" data-pyxis-component="panel" data-pyxis-part="root">
      <header className="app-calendar-month-header">
        <h2>May 2025</h2>
        <div className="app-calendar-controls"><button aria-label="Previous month"><Icon name="chevron-left" size={14}/></button><Button variant="outline" size="sm">Today</Button><button aria-label="Next month"><Icon name="chevron-right" size={14}/></button></div>
      </header>
      <div className="app-calendar-weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="app-calendar-month-grid">{cells.map((day, index) => {
        const dayEvents = day ? eventsOnDay(events, day) : [];
        return <div key={index} className="app-calendar-cell" data-empty={!day || undefined} data-today={day === 2 || undefined}>{day && <><b>{day}</b>{dayEvents.map((event) => <CalendarEventChip key={event.date + event.label} event={event}/>)}</>}</div>;
      })}</div>
      <CalendarLegend />
    </section>
  );
}

export function CalendarLegend() {
  return <div className="app-calendar-legend">{[['Confirmed','confirmed'],['Hold','hold'],['Blocked','blocked']].map(([label, status]) => <span key={status} data-status={status}><i/>{label}</span>)}</div>;
}

export function CalendarBoard({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="app-calendar-layout" data-section="calendar-board">
      <CalendarMonthPanel events={events}/>
      <CalendarAgenda events={events}/>
    </div>
  );
}

export function CalendarAgenda({ events: _events }: { events: CalendarEvent[] }) {
  const todayShow = seedShows[0];
  return (
    <aside className="app-calendar-side" data-section="calendar-agenda">
      <Panel title="May at a glance">
        <div className="app-calendar-glance-list">
          {[['Confirmed','5','confirmed'], ['Hold','1','hold'], ['Blocked','1','blocked'], ['Open nights','24','open']].map(([label, value, status]) => <span key={label} data-status={status}>{label}<b>{value}</b></span>)}
        </div>
      </Panel>
      <Panel title="Today · May 2">
        <div className="app-calendar-today-card">
          <header><strong>{todayShow.artist}</strong><StatusPill tone="confirmed">Confirmed</StatusPill></header>
          <p>Doors {todayShow.doors} · {todayShow.age} · $12 adv<br/>Expected draw: ~{todayShow.draw} / {todayShow.capacity}</p>
          <Button size="sm" fullWidth>Open show</Button>
        </div>
        <Button variant="outline" iconLeft="plus" fullWidth>Add to today</Button>
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
  return <Panel title="Recently processed" action={<button className="app-panel-link-action">View archive</button>} section="bookings-processed"><div className="app-table-wrap"><table className="app-table app-bookings-processed-table"><thead><tr><th>Artist</th><th>Requested</th><th>Genre</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{processed.map((booking)=><BookingQueueRow key={booking.id} booking={booking}/>)}</tbody></table></div></Panel>;
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
