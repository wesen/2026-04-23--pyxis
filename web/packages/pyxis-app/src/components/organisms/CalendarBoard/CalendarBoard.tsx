import type { CalendarEvent } from 'pyxis-types';
import { CalendarMonthPanel } from '../CalendarMonthPanel';
import { CalendarAgenda } from '../CalendarAgenda';
import './CalendarBoard.css';

export function CalendarBoard({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="app-calendar-layout" data-section="calendar-board">
      <CalendarMonthPanel events={events}/>
      <CalendarAgenda events={events}/>
    </div>
  );
}
