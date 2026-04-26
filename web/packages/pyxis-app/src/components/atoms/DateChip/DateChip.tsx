import { appPart } from '../../parts';
import './DateChip.css';

export type DateChipVariant = 'chip' | 'inline';

export type DateChipProps = {
  date: string;
  kicker?: string;
  variant?: DateChipVariant;
};

export function formatShortDate(date: string) { return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
export function DateChip({ date, kicker, variant = 'chip' }: DateChipProps) {
  const d = new Date(`${date}T00:00:00`);
  return <time className={`app-date-chip app-date-chip-${variant}`} dateTime={date} {...appPart('date-chip')}><span {...appPart('date-chip','kicker')}>{kicker ?? d.toLocaleDateString('en-US', { weekday: 'short' })}</span><strong {...appPart('date-chip','date')}>{formatShortDate(date)}</strong></time>;
}
