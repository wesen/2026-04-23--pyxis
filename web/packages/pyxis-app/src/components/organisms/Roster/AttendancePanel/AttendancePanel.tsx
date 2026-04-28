import { useEffect, useState } from 'react';
import type { AttendanceLog } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { AttendanceStat } from '../../../molecules/AttendanceStat';
import { appPart } from '../../../parts';
import '../../../molecules/BookingCard/BookingCard.css';
import '../../Dashboard/DashboardMetricsGrid/DashboardMetricsGrid.css';
import './AttendancePanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type AttendanceDraft = Pick<AttendanceLog, 'draw' | 'notes' | 'incident' | 'incidentNotes'>;

export type AttendancePanelProps = {
  entries: AttendanceLog[];
  onUpdateEntry?: (entry: AttendanceLog, draft: AttendanceDraft) => void;
  savingEntryId?: number;
};

function attendanceEntryKey(entry: AttendanceLog) {
  return entry.id || entry.showId;
}

function AttendanceEditorCard({ entry, onUpdateEntry, isUpdating }: { entry: AttendanceLog; onUpdateEntry?: AttendancePanelProps['onUpdateEntry']; isUpdating?: boolean }) {
  const [draft, setDraft] = useState<AttendanceDraft>({ draw: entry.draw, notes: entry.notes, incident: entry.incident, incidentNotes: entry.incidentNotes });

  useEffect(() => {
    setDraft({ draw: entry.draw, notes: entry.notes, incident: entry.incident, incidentNotes: entry.incidentNotes });
  }, [entry]);

  const validationError = draft.draw < 0
    ? 'Draw cannot be negative.'
    : draft.draw > 10000
      ? 'Draw looks too high. Double-check before saving.'
      : draft.incident && !draft.incidentNotes.trim()
        ? 'Incident notes are required when Incident is checked.'
        : undefined;

  return (
    <article className="app-booking-card app-attendance-edit-card">
      <h3>{entry.artist}</h3>
      <p>{entry.date} · {entry.draw !== undefined && entry.draw > 0 ? `${entry.draw} attendees` : 'needs report'}</p>
      <div className="app-attendance-edit-grid">
        <label><span>Draw</span><input aria-invalid={draft.draw < 0 || draft.draw > 10000} aria-label={`Draw for ${entry.artist}`} type="number" min={0} max={10000} value={draft.draw || 0} onChange={(event) => setDraft((current) => ({ ...current, draw: Number(event.target.value) }))} /></label>
        <label className="app-attendance-checkbox"><input aria-label={`Incident for ${entry.artist}`} type="checkbox" checked={draft.incident} onChange={(event) => setDraft((current) => ({ ...current, incident: event.target.checked, incidentNotes: event.target.checked ? current.incidentNotes : '' }))} /><span>Incident</span></label>
        <label><span>Notes</span><textarea aria-label={`Notes for ${entry.artist}`} rows={3} value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} /></label>
        <label><span>Incident notes</span><textarea aria-label={`Incident notes for ${entry.artist}`} disabled={!draft.incident} aria-invalid={Boolean(draft.incident && !draft.incidentNotes.trim())} rows={3} value={draft.incidentNotes} onChange={(event) => setDraft((current) => ({ ...current, incidentNotes: event.target.value }))} /></label>
      </div>
      {validationError && <div className="app-field-error" role="alert">{validationError}</div>}
      {onUpdateEntry && <Button size="sm" variant="outline" isLoading={isUpdating} disabled={Boolean(validationError)} onClick={() => onUpdateEntry(entry, draft)}>Save attendance</Button>}
    </article>
  );
}

export function AttendancePanel({ entries, onUpdateEntry, savingEntryId }: AttendancePanelProps) {
  const logged = entries.filter((entry) => entry.draw !== undefined && entry.draw > 0);
  const avg = Math.round(logged.reduce((total, entry) => total + (entry.draw ?? 0), 0) / Math.max(logged.length, 1));
  return <div {...appPart('attendance-panel')}><div className="app-metrics-grid compact"><AttendanceStat label="Logged" value={logged.length}/><AttendanceStat label="Needs log" value={entries.length-logged.length}/><AttendanceStat label="Average draw" value={avg}/></div>{entries.length > 0 ? <div className="app-card-list">{entries.map((entry)=><AttendanceEditorCard key={attendanceEntryKey(entry)} entry={entry} onUpdateEntry={onUpdateEntry} isUpdating={savingEntryId === attendanceEntryKey(entry)} />)}</div> : <AppEmptyState title="No attendance reports yet." />}</div>;
}
