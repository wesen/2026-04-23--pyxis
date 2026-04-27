import { useEffect, useState } from 'react';
import type { AttendanceLog } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { AttendanceStat } from '../../../molecules/AttendanceStat';
import { appPart } from '../../../parts';
import '../../../molecules/BookingCard/BookingCard.css';
import '../DashboardMetricsGrid/DashboardMetricsGrid.css';
import './AttendancePanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type AttendanceDraft = Pick<AttendanceLog, 'draw' | 'notes' | 'incident' | 'incidentNotes'>;

export type AttendancePanelProps = {
  entries: AttendanceLog[];
  onUpdateEntry?: (entry: AttendanceLog, draft: AttendanceDraft) => void;
  isUpdating?: boolean;
};

function AttendanceEditorCard({ entry, onUpdateEntry, isUpdating }: { entry: AttendanceLog; onUpdateEntry?: AttendancePanelProps['onUpdateEntry']; isUpdating?: boolean }) {
  const [draft, setDraft] = useState<AttendanceDraft>({ draw: entry.draw, notes: entry.notes, incident: entry.incident, incidentNotes: entry.incidentNotes });

  useEffect(() => {
    setDraft({ draw: entry.draw, notes: entry.notes, incident: entry.incident, incidentNotes: entry.incidentNotes });
  }, [entry]);

  return (
    <article className="app-booking-card app-attendance-edit-card">
      <h3>{entry.artist}</h3>
      <p>{entry.date} · {entry.draw !== undefined && entry.draw > 0 ? `${entry.draw} attendees` : 'needs report'}</p>
      <div className="app-attendance-edit-grid">
        <label><span>Draw</span><input aria-label={`Draw for ${entry.artist}`} type="number" min={0} value={draft.draw || 0} onChange={(event) => setDraft((current) => ({ ...current, draw: Number(event.target.value) }))} /></label>
        <label className="app-attendance-checkbox"><input aria-label={`Incident for ${entry.artist}`} type="checkbox" checked={draft.incident} onChange={(event) => setDraft((current) => ({ ...current, incident: event.target.checked }))} /><span>Incident</span></label>
        <label><span>Notes</span><textarea aria-label={`Notes for ${entry.artist}`} rows={3} value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} /></label>
        <label><span>Incident notes</span><textarea aria-label={`Incident notes for ${entry.artist}`} rows={3} value={draft.incidentNotes} onChange={(event) => setDraft((current) => ({ ...current, incidentNotes: event.target.value }))} /></label>
      </div>
      {onUpdateEntry && <Button size="sm" variant="outline" isLoading={isUpdating} onClick={() => onUpdateEntry(entry, draft)}>Save attendance</Button>}
    </article>
  );
}

export function AttendancePanel({ entries, onUpdateEntry, isUpdating }: AttendancePanelProps) {
  const logged = entries.filter((entry) => entry.draw !== undefined && entry.draw > 0);
  const avg = Math.round(logged.reduce((total, entry) => total + (entry.draw ?? 0), 0) / Math.max(logged.length, 1));
  return <div {...appPart('attendance-panel')}><div className="app-metrics-grid compact"><AttendanceStat label="Logged" value={logged.length}/><AttendanceStat label="Needs log" value={entries.length-logged.length}/><AttendanceStat label="Average draw" value={avg}/></div>{entries.length > 0 ? <div className="app-card-list">{entries.map((entry)=><AttendanceEditorCard key={entry.id || entry.showId} entry={entry} onUpdateEntry={onUpdateEntry} isUpdating={isUpdating} />)}</div> : <AppEmptyState title="No attendance reports yet." />}</div>;
}
