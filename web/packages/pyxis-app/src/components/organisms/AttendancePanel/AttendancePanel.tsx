import type { AttendanceLog } from 'pyxis-types';
import { AttendanceStat } from '../../molecules/AttendanceStat';
import { appPart } from '../../parts';
import '../../molecules/BookingCard/BookingCard.css';
import '../DashboardMetricsGrid/DashboardMetricsGrid.css';
import './AttendancePanel.css';
import { AppEmptyState } from '../../molecules/AppEmptyState';

export type AttendancePanelProps = {
  entries: AttendanceLog[];
  onUpdateEntry?: (entry: AttendanceLog) => void;
  isUpdating?: boolean;
};

export function AttendancePanel({ entries, onUpdateEntry, isUpdating }: AttendancePanelProps) {
  const logged = entries.filter((entry) => entry.draw !== undefined && entry.draw > 0);
  const avg = Math.round(logged.reduce((total, entry) => total + (entry.draw ?? 0), 0) / Math.max(logged.length, 1));
  return <div {...appPart('attendance-panel')}><div className="app-metrics-grid compact"><AttendanceStat label="Logged" value={logged.length}/><AttendanceStat label="Needs log" value={entries.length-logged.length}/><AttendanceStat label="Average draw" value={avg}/></div>{entries.length > 0 ? <div className="app-card-list">{entries.map((entry)=><article className="app-booking-card" key={entry.id}><h3>{entry.artist}</h3><p>{entry.date} · {entry.draw !== undefined && entry.draw > 0 ? `${entry.draw} attendees` : 'needs report'}</p><small>{entry.notes ?? 'No notes yet.'}</small>{onUpdateEntry && <button className="app-inline-action" type="button" disabled={isUpdating} onClick={() => onUpdateEntry(entry)}>{entry.draw > 0 ? 'Save note' : 'Mark logged'}</button>}</article>)}</div> : <AppEmptyState title="No attendance reports yet." />}</div>;
}
