import type { CalendarEvent } from 'pyxis-types';
import { CalendarMonthPanel } from '../CalendarMonthPanel';
import { CalendarAgenda } from '../CalendarAgenda';
import './CalendarBoard.css';

export type CalendarBoardProps = {
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
  onOpenShow?: (showId: number) => void;
  onAddToday?: () => void;
};

export function CalendarBoard({ events, monthLabel, year, monthIndex, selectedDate, onPreviousMonth, onToday, onNextMonth, onSelectDate, onEventClick, onOpenShow, onAddToday }: CalendarBoardProps) {
  return (
    <div className="app-calendar-layout" data-section="calendar-board">
      <CalendarMonthPanel events={events} monthLabel={monthLabel} year={year} monthIndex={monthIndex} selectedDate={selectedDate} onPreviousMonth={onPreviousMonth} onToday={onToday} onNextMonth={onNextMonth} onSelectDate={onSelectDate} onEventClick={onEventClick}/>
      <CalendarAgenda events={events} onOpenShow={(show) => onOpenShow?.(show.id)} onAddToday={onAddToday}/>
    </div>
  );
}
