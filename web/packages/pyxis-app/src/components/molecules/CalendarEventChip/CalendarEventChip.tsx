import type { CalendarEvent } from 'pyxis-types';
import { StatusDot, statusToTone } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './CalendarEventChip.css';

export type CalendarEventChipProps = {
  event: CalendarEvent;
};

export function CalendarEventChip({ event }: CalendarEventChipProps) { const tone = statusToTone(event.status); return <span className="app-calendar-event-chip" data-status={tone} {...appPart('calendar-event-chip')}><StatusDot status={event.status} />{event.label}</span>; }
