import type { CalendarEvent } from 'pyxis-types';
import { StatusDot } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './CalendarEventChip.css';

export type CalendarEventChipProps = {
  event: CalendarEvent;
};

export function CalendarEventChip({ event }: CalendarEventChipProps) { return <span className="app-calendar-event-chip" data-status={event.status} {...appPart('calendar-event-chip')}><StatusDot tone={event.status} />{event.label}</span>; }
