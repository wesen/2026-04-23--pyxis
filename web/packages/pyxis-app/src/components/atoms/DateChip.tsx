import { appPart } from '../parts';
import './DateChip.css';
export function formatShortDate(date: string) { return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
export function DateChip({ date, kicker }: { date: string; kicker?: string }) {
  const d = new Date(`${date}T00:00:00`);
  return <time className="app-date-chip" dateTime={date} {...appPart('date-chip')}><span {...appPart('date-chip','kicker')}>{kicker ?? d.toLocaleDateString('en-US', { weekday: 'short' })}</span><strong {...appPart('date-chip','date')}>{formatShortDate(date)}</strong></time>;
}
