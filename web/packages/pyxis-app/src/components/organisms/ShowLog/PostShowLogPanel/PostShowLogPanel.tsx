import { useMemo, useState } from 'react';
import { Button } from 'pyxis-components';
import type { ShowLogEntry, ShowLogStatus, ShowLogUpdateInput } from '../../../../api/appApi';
import { MetricCard } from '../../../molecules/MetricCard';
import { AppEmptyState } from '../../../molecules/AppEmptyState';
import { MetadataStrip } from '../../../molecules/MetadataStrip';
import { NoteBlock } from '../../../molecules/NoteBlock';
import { StatusBadge, type StatusBadgeTone } from '../../../molecules/StatusBadge';
import { appPart } from '../../../parts';
import '../../../molecules/Table/Table.css';
import '../../Dashboard/DashboardMetricsGrid/DashboardMetricsGrid.css';
import './PostShowLogPanel.css';
import { PostShowLogEditorModal } from './PostShowLogEditorModal';

export type PostShowLogFilter = ShowLogStatus | 'all';

export type PostShowLogPanelProps = {
  entries: ShowLogEntry[];
  activeFilter?: PostShowLogFilter;
  search?: string;
  savingShowId?: number;
  onFilterChange?: (filter: PostShowLogFilter) => void;
  onSearchChange?: (search: string) => void;
  onSaveEntry?: (update: ShowLogUpdateInput) => void;
};

const filters: Array<{ value: PostShowLogFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'needs-log', label: 'Needs log' },
  { value: 'logged', label: 'Logged' },
  { value: 'incident', label: 'Incidents' },
];

function matchesSearch(entry: ShowLogEntry, search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return [entry.artist, entry.date, entry.genre, entry.showNotes, entry.postShowNotes, entry.incidentNotes].some((value) => String(value || '').toLowerCase().includes(needle));
}

function formatShortDate(date: string) {
  if (!date) return '—';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function statusLabel(entry: ShowLogEntry) {
  if (entry.logStatus === 'incident') return 'Incident';
  if (entry.logStatus === 'logged') return 'Logged';
  return 'Needs log';
}

function statusTone(entry: ShowLogEntry): StatusBadgeTone {
  if (entry.logStatus === 'incident') return 'danger';
  if (entry.logStatus === 'logged') return 'success';
  return 'warning';
}

function actionLabel(entry: ShowLogEntry) {
  if (entry.logStatus === 'needs-log') return 'Log';
  if (entry.logStatus === 'incident') return 'Review';
  return 'Edit';
}

export function PostShowLogPanel({ entries, activeFilter = 'all', search = '', savingShowId, onFilterChange, onSearchChange, onSaveEntry }: PostShowLogPanelProps) {
  const [expandedShowId, setExpandedShowId] = useState<number | undefined>();
  const [editingShowId, setEditingShowId] = useState<number | undefined>();
  const counts = useMemo(() => ({
    all: entries.length,
    needsLog: entries.filter((entry) => entry.logStatus === 'needs-log').length,
    logged: entries.filter((entry) => entry.logStatus === 'logged').length,
    incident: entries.filter((entry) => entry.logStatus === 'incident').length,
  }), [entries]);
  const averageDraw = useMemo(() => {
    const logged = entries.filter((entry) => entry.draw && entry.draw > 0);
    return Math.round(logged.reduce((sum, entry) => sum + (entry.draw ?? 0), 0) / Math.max(logged.length, 1));
  }, [entries]);
  const visibleEntries = entries.filter((entry) => (activeFilter === 'all' || entry.logStatus === activeFilter) && matchesSearch(entry, search));
  const editingEntry = entries.find((entry) => entry.showId === editingShowId);

  const saveEntry = (update: ShowLogUpdateInput) => {
    onSaveEntry?.(update);
    setEditingShowId(undefined);
  };

  return (
    <div className="app-post-show-log-panel" {...appPart('post-show-log-panel')}>
      <div className="app-metrics-grid compact" {...appPart('post-show-log-panel', 'summary')}>
        <MetricCard label="Needs log" value={counts.needsLog} tone="warning" caption="Shows requiring report" />
        <MetricCard label="Logged" value={counts.logged} tone="success" caption="Completed reports" />
        <MetricCard label="Incidents" value={counts.incident} tone="warning" caption="Safety follow-up" />
        <MetricCard label="Avg draw" value={averageDraw} tone="info" caption="Logged shows" />
      </div>

      <div className="app-post-show-log-toolbar" {...appPart('post-show-log-panel', 'toolbar')}>
        <label>
          <span>Search post-show logs</span>
          <input value={search} placeholder="Artist, date, notes…" onChange={(event) => onSearchChange?.(event.target.value)} />
        </label>
        <div className="app-post-show-log-toolbar__chips" role="group" aria-label="Filter post-show logs">
          {filters.map((filter) => {
            const count = filter.value === 'all' ? counts.all : filter.value === 'needs-log' ? counts.needsLog : filter.value === 'logged' ? counts.logged : counts.incident;
            return <button key={filter.value} type="button" data-active={activeFilter === filter.value} aria-pressed={activeFilter === filter.value} onClick={() => onFilterChange?.(filter.value)}>{filter.label} {count}</button>;
          })}
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <div className="app-table-wrap" {...appPart('post-show-log-panel', 'table-wrap')}>
          <table className="app-table app-post-show-log-table" {...appPart('post-show-log-panel', 'table')}>
            <thead><tr><th>Date</th><th>Artist</th><th>Status</th><th>Draw</th><th>Incident</th><th aria-label="Actions" /></tr></thead>
            <tbody>{visibleEntries.map((entry) => {
              const expanded = expandedShowId === entry.showId;
              return (
                <>
                  <tr key={`${entry.showId}-row`} className="app-table-row app-post-show-log-row" data-expanded={expanded || undefined} {...appPart('post-show-log-row')}>
                    <td data-cell="date"><strong>{formatShortDate(entry.date)}</strong><span>{entry.date}</span></td>
                    <td data-cell="artist"><strong>{entry.artist}</strong><span>{entry.genre || 'Genre not set'}</span></td>
                    <td data-cell="status"><StatusBadge label={statusLabel(entry)} tone={statusTone(entry)} /></td>
                    <td data-cell="draw">{entry.draw && entry.draw > 0 ? entry.draw : '—'}</td>
                    <td data-cell="incident"><span data-incident={entry.incident || undefined}>{entry.incident ? 'Yes' : 'No'}</span></td>
                    <td data-cell="actions"><div className="app-post-show-log-row__actions"><Button size="sm" variant="ghost" onClick={() => setEditingShowId(entry.showId)}>{actionLabel(entry)}</Button><Button size="sm" variant="ghost" aria-expanded={expanded} onClick={() => setExpandedShowId(expanded ? undefined : entry.showId)}>{expanded ? 'Hide' : 'Details'}</Button></div></td>
                  </tr>
                  {expanded && <tr key={`${entry.showId}-detail`} className="app-post-show-log-detail-row"><td colSpan={6}><div className="app-post-show-log-detail"><MetadataStrip items={[{ label: 'Updated', value: entry.loggedByName || entry.updatedAt || '—', tone: entry.updatedAt ? 'default' : 'muted' }, { label: 'Show ID', value: `#${entry.showId}` }]} /><NoteBlock label="Show notes" value={entry.showNotes} empty="No show notes." tone="muted" /><NoteBlock label="Post-show notes" value={entry.postShowNotes} empty="No post-show notes yet." /><NoteBlock label="Incident notes" value={entry.incidentNotes} empty="No incident notes." tone={entry.incident ? 'danger' : 'muted'} /></div></td></tr>}
                </>
              );
            })}</tbody>
          </table>
        </div>
      ) : <AppEmptyState title="No post-show logs match those filters." />}

      <PostShowLogEditorModal entry={editingEntry} isOpen={Boolean(editingEntry)} isSaving={editingEntry ? savingShowId === editingEntry.showId : false} onCancel={() => setEditingShowId(undefined)} onSave={saveEntry} />
    </div>
  );
}
