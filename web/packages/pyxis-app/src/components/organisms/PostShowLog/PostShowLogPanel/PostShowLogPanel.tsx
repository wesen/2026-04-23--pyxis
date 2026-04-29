import { useMemo, useState } from 'react';
import type { ShowLogEntry, ShowLogStatus, ShowLogUpdateInput } from '../../../../api/appApi';
import { MetricCard } from '../../../molecules/MetricCard';
import { AppEmptyState } from '../../../molecules/AppEmptyState';
import { PostShowLogEntryCard } from '../PostShowLogEntryCard';
import { appPart } from '../../../parts';
import '../../Dashboard/DashboardMetricsGrid/DashboardMetricsGrid.css';
import './PostShowLogPanel.css';

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

export function PostShowLogPanel({ entries, activeFilter = 'all', search = '', savingShowId, onFilterChange, onSearchChange, onSaveEntry }: PostShowLogPanelProps) {
  const [expandedShowId, setExpandedShowId] = useState<number | undefined>();
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
        <div className="app-post-show-log-list" {...appPart('post-show-log-panel', 'list')}>
          {visibleEntries.map((entry) => <PostShowLogEntryCard key={entry.showId} entry={entry} expanded={expandedShowId === entry.showId} isSaving={savingShowId === entry.showId} onToggleExpanded={setExpandedShowId} onCancel={() => setExpandedShowId(undefined)} onSave={onSaveEntry} />)}
        </div>
      ) : <AppEmptyState title="No post-show logs match those filters." />}
    </div>
  );
}
