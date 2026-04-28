import type { CalendarEvent } from 'pyxis-types';
import { Button, Icon } from 'pyxis-components';
import { CalendarEventChip } from '../../../molecules/CalendarEventChip';
import { CalendarLegend } from '../CalendarLegend';
import './CalendarMonthPanel.css';

function eventsOnDate(events: CalendarEvent[], date: string) {
  return events.filter((event) => event.date === date);
}

function formatDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export type CalendarMonthPanelProps = {
  events: CalendarEvent[];
  monthLabel: string;
  year: number;
  monthIndex: number;
  selectedDate?: string;
  onPreviousMonth?: () => void;
  onToday?: () => void;
  onNextMonth?: () => void;
  onSelectDate?: (date: string) => void;
  onEventClick?: (event: CalendarEvent) => void;
};

export function CalendarMonthPanel({ events, monthLabel, year, monthIndex, selectedDate, onPreviousMonth, onToday, onNextMonth, onSelectDate, onEventClick }: CalendarMonthPanelProps) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);
  const cells: Array<number | null> = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  return (
    <section className="app-panel app-calendar-month-panel" data-section="calendar-month" data-pyxis-component="panel" data-pyxis-part="root">
      <header className="app-calendar-month-header">
        <h2>{monthLabel}</h2>
        <div className="app-calendar-controls"><button aria-label="Previous month" type="button" onClick={onPreviousMonth}><Icon name="chevron-left" size={14}/></button><Button variant="outline" size="sm" onClick={onToday}>Today</Button><button aria-label="Next month" type="button" onClick={onNextMonth}><Icon name="chevron-right" size={14}/></button></div>
      </header>
      <div className="app-calendar-weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="app-calendar-month-grid">{cells.map((day, index) => {
        const date = day ? formatDate(year, monthIndex, day) : '';
        const dayEvents = date ? eventsOnDate(events, date) : [];
        return <div key={index} className="app-calendar-cell" data-empty={!day || undefined} data-today={date === today || undefined} data-selected={date === selectedDate || undefined}>{day && <><button className="app-calendar-day-button" type="button" onClick={() => onSelectDate?.(date)}><b>{day}</b><span>{dayEvents.length === 0 ? 'Open night' : `${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}`}</span></button>{dayEvents.map((event) => <button key={`${event.kind}-${event.id}-${event.date}-${event.label}`} className="app-calendar-event-button" type="button" onClick={(clickEvent) => { clickEvent.stopPropagation(); onEventClick?.(event); }}><CalendarEventChip event={event}/></button>)}</>}</div>;
      })}</div>
      <CalendarLegend />
    </section>
  );
}
