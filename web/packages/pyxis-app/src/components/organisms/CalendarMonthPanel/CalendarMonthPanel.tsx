import type { CalendarEvent } from 'pyxis-types';
import { Button, Icon } from 'pyxis-components';
import { CalendarEventChip } from '../../molecules/CalendarEventChip';
import { CalendarLegend } from '../CalendarLegend';
import './CalendarMonthPanel.css';

function eventsOnDay(events: CalendarEvent[], day: number) {
  return events.filter((event) => new Date(`${event.date}T00:00:00`).getDate() === day);
}

export type CalendarMonthPanelProps = {
  events: CalendarEvent[];
  monthLabel?: string;
  year?: number;
  monthIndex?: number;
};

export function CalendarMonthPanel({ events, monthLabel = 'May 2025', year = 2025, monthIndex = 4 }: CalendarMonthPanelProps) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const cells: Array<number | null> = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: 31 }, (_, index) => index + 1)];
  return (
    <section className="app-panel app-calendar-month-panel" data-section="calendar-month" data-pyxis-component="panel" data-pyxis-part="root">
      <header className="app-calendar-month-header">
        <h2>{monthLabel}</h2>
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
