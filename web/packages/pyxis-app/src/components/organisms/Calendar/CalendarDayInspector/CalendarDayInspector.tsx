import type { CalendarEvent } from 'pyxis-types';
import { CalendarEventKind } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel } from '../../Panels';
import { EmptyState } from '../../../../pages/shared';
import './CalendarDayInspector.css';

export type CalendarDayInspectorProps = {
  selectedDate: string;
  events: CalendarEvent[];
  onCreateShow?: (date: string) => void;
  onAddHold?: (date: string) => void;
  onBlockDay?: (date: string) => void;
  onOpenShow?: (event: CalendarEvent) => void;
  onRemoveItem?: (event: CalendarEvent) => void;
};

export function CalendarDayInspector({ selectedDate, events, onCreateShow, onAddHold, onBlockDay, onOpenShow, onRemoveItem }: CalendarDayInspectorProps) {
  return (
    <Panel title={`Selected · ${selectedDate}`} section="calendar-selected-day">
      <div className="app-calendar-day-actions">
        <Button size="sm" onClick={() => onCreateShow?.(selectedDate)}>Create show on this day</Button>
        <Button size="sm" variant="outline" onClick={() => onAddHold?.(selectedDate)}>Add hold</Button>
        <Button size="sm" variant="outline" onClick={() => onBlockDay?.(selectedDate)}>Block day</Button>
      </div>
      {events.length > 0 ? (
        <div className="app-calendar-day-list">
          {events.map((event) => (
            <div key={`${event.kind}-${event.id}`} className="app-calendar-day-item" data-kind={event.kind}>
              <div><strong>{event.label}</strong><span>{event.kind === CalendarEventKind.SHOW ? 'Show' : event.kind === CalendarEventKind.HOLD ? 'Hold' : 'Blocked'} · {event.date}</span></div>
              <button className="app-panel-link-action" type="button" onClick={() => event.kind === CalendarEventKind.SHOW ? onOpenShow?.(event) : onRemoveItem?.(event)}>{event.kind === CalendarEventKind.SHOW ? 'Open/Edit' : 'Remove'}</button>
            </div>
          ))}
        </div>
      ) : <EmptyState label="No calendar items on the selected day." />}
    </Panel>
  );
}
