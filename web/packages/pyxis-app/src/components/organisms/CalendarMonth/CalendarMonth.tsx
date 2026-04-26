import type { CalendarEvent } from 'pyxis-types';
import { CalendarEventChip } from '../../molecules/CalendarEventChip';
import { appPart } from '../../parts';
import './CalendarMonth.css';
export function CalendarMonth({ events }: { events: CalendarEvent[] }) { const days = Array.from({ length: 35 }, (_, i) => i + 1); return <div className="app-calendar-month" {...appPart('calendar-month')}>{days.map((day)=><div className="app-calendar-day" key={day}><b>{day}</b>{events.filter((e)=>new Date(`${e.date}T00:00:00`).getDate()===day).map((event)=><CalendarEventChip key={event.date+event.label} event={event}/>)}</div>)}</div>; }
