import { CalendarEventKind, type CalendarEvent } from 'pyxis-types';
import { StatusDot } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './CalendarEventChip.css';

export type CalendarEventChipProps = {
  event: CalendarEvent;
};

const kindToTone = (event: CalendarEvent): string => {
  if (event.kind === CalendarEventKind.EXTERNAL) return 'external';
  switch (event.status) {
    case 1: return 'confirmed'; // CONFIRMED
    case 5: return 'hold';     // HOLD
    case 6: return 'blocked';  // BLOCKED
    default: return 'neutral';
  }
};

export function CalendarEventChip({ event }: CalendarEventChipProps) {
  const tone = kindToTone(event);
  return (
    <span className="app-calendar-event-chip" data-status={tone} data-kind={event.kind === CalendarEventKind.EXTERNAL ? 'external' : undefined} {...appPart('calendar-event-chip')}>
      <StatusDot tone={tone as any} />
      {event.label}
    </span>
  );
}
