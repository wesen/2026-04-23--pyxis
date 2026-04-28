import type { CalendarEvent } from 'pyxis-types';
import { CalendarMonthPanel } from '../CalendarMonthPanel';
import { CalendarAgenda } from '../CalendarAgenda';
import './CalendarBoard.css';

export type CalendarBoardProps = {
  events: CalendarEvent[];
  onOpenShow?: (showId: number) => void;
  onAddToday?: () => void;
};

export function CalendarBoard({ events, onOpenShow, onAddToday }: CalendarBoardProps) {
  return (
    <div className="app-calendar-layout" data-section="calendar-board">
      <CalendarMonthPanel events={events}/>
      <CalendarAgenda events={events} onOpenShow={(show) => onOpenShow?.(show.id)} onAddToday={onAddToday}/>
    </div>
  );
}
