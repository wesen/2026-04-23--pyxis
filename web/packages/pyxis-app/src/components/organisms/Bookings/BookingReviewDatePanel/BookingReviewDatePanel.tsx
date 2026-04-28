import { useEffect, useMemo, useState } from 'react';
import type { CalendarEvent, Submission } from 'pyxis-types';
import { CalendarEventKind } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel } from '../../Panels';
import './BookingReviewDatePanel.css';

export type BookingReviewDatePanelProps = {
  booking?: Submission;
  events?: CalendarEvent[];
  isSaving?: boolean;
  onSaveDate?: (date: string) => void;
  statusLabel?: string;
  detail?: string;
};

function describeDate(date: string, events: CalendarEvent[]) {
  const sameDay = events.filter((event) => event.date === date);
  if (sameDay.length === 0) return { statusLabel: '✓ Date is available', detail: `${date} is an open night.` };
  const hasShow = sameDay.some((event) => event.kind === CalendarEventKind.SHOW);
  const hasBlocked = sameDay.some((event) => event.kind === CalendarEventKind.BLOCKED);
  if (hasBlocked) return { statusLabel: '✕ Date is blocked', detail: sameDay.map((event) => event.label).join(' · ') };
  if (hasShow) return { statusLabel: '△ Possible show conflict', detail: sameDay.map((event) => event.label).join(' · ') };
  return { statusLabel: '△ Hold exists', detail: sameDay.map((event) => event.label).join(' · ') };
}

export function BookingReviewDatePanel({ booking, events = [], isSaving, onSaveDate, statusLabel, detail }: BookingReviewDatePanelProps) {
  const [selectedDate, setSelectedDate] = useState(booking?.preferredDate ?? '');
  useEffect(() => { setSelectedDate(booking?.preferredDate ?? ''); }, [booking?.preferredDate]);
  const computed = useMemo(() => selectedDate ? describeDate(selectedDate, events) : { statusLabel: 'Choose a date', detail: 'Select a date before approving this booking.' }, [events, selectedDate]);
  const label = statusLabel ?? computed.statusLabel;
  const copy = detail ?? computed.detail;
  return (
    <Panel title="Date check" section="booking-review-date">
      <div className="app-booking-date-check">
        <label><span>Preferred date</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
        <p className={label.startsWith('✓') ? 'app-success-note' : 'app-warning-note'}>{label}</p>
        <p className="app-muted-copy">{copy}</p>
        {selectedDate !== booking?.preferredDate && <Button size="sm" variant="outline" onClick={() => onSaveDate?.(selectedDate)} isLoading={isSaving} disabled={!selectedDate}>Save selected date</Button>}
      </div>
    </Panel>
  );
}
