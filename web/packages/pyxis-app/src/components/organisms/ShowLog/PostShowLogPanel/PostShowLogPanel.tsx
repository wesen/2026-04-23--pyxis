import { Fragment, useMemo, useState } from 'react';
import { Button, Icon } from 'pyxis-components';
import type { ShowLogEntry, ShowLogStatus, ShowLogUpdateInput } from '../../../../api/appApi';
import { AppEmptyState } from '../../../molecules/AppEmptyState';
import { StatusBadge, type StatusBadgeTone } from '../../../molecules/StatusBadge';
import { Panel } from '../../Panel';
import { appPart } from '../../../parts';
import '../../../molecules/Table/Table.css';
import './PostShowLogPanel.css';
import { PostShowLogEditorModal } from '../PostShowLogEditorModal';

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

function matchesSearch(entry: ShowLogEntry, search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return [entry.artist, entry.date, entry.genre, entry.showNotes, entry.postShowNotes, entry.incidentNotes].some((value) => String(value || '').toLowerCase().includes(needle));
}

function formatShortDate(date: string) {
  if (!date) return '—';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatLongDate(date: string) {
  if (!date) return 'Unscheduled';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' });
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

export function PostShowLogPanel({ entries, activeFilter = 'all', search = '', savingShowId, onSaveEntry }: PostShowLogPanelProps) {
  const [expandedShowId, setExpandedShowId] = useState<number | undefined>();
  const [editingShowId, setEditingShowId] = useState<number | undefined>();
  const counts = useMemo(() => ({
    needsLog: entries.filter((entry) => entry.logStatus === 'needs-log').length,
    incident: entries.filter((entry) => entry.logStatus === 'incident').length,
  }), [entries]);
  const visibleEntries = entries.filter((entry) => (activeFilter === 'all' || entry.logStatus === activeFilter) && matchesSearch(entry, search));
  const editingEntry = entries.find((entry) => entry.showId === editingShowId);

  const saveEntry = (update: ShowLogUpdateInput) => {
    onSaveEntry?.(update);
    setEditingShowId(undefined);
  };

  return (
    <div className="app-post-show-log-panel" {...appPart('post-show-log-panel')}>
      <Panel
        title={`Post-show log · ${visibleEntries.length}`}
        action={<span className="app-panel-note">Needs log {counts.needsLog} · Incidents {counts.incident}</span>}
        section="post-show-log"
      >
        {visibleEntries.length > 0 ? (
          <div className="app-table-wrap" {...appPart('post-show-log-panel', 'table-wrap')}>
            <table className="app-table app-post-show-log-table" {...appPart('post-show-log-panel', 'table')}>
              <thead><tr><th>Date</th><th>Artist</th><th>Status</th><th>Draw</th><th>Incident</th><th aria-label="Actions" /></tr></thead>
              <tbody>{visibleEntries.map((entry) => {
                const expanded = expandedShowId === entry.showId;
                return (
                  <Fragment key={entry.showId}>
                    <tr className="app-table-row app-post-show-log-row" data-expanded={expanded || undefined} {...appPart('post-show-log-row')}>
                      <td data-cell="date"><div className="app-post-show-log-date"><strong>{formatShortDate(entry.date)}</strong><span>{formatLongDate(entry.date)}</span></div></td>
                      <td data-cell="artist"><strong>{entry.artist}</strong><span>{entry.genre || 'Genre not set'}</span></td>
                      <td data-cell="status"><StatusBadge label={statusLabel(entry)} tone={statusTone(entry)} /></td>
                      <td data-cell="draw">{entry.draw && entry.draw > 0 ? entry.draw : '—'}</td>
                      <td data-cell="incident"><span data-incident={entry.incident || undefined}>{entry.incident ? 'Yes' : 'No'}</span></td>
                      <td data-cell="actions"><div className="app-post-show-log-row__actions"><button className="app-row-edit app-post-show-log-edit" title={actionLabel(entry)} aria-label={`${actionLabel(entry)} ${entry.artist}`} onClick={() => setEditingShowId(entry.showId)}><Icon name="edit" size={14} /></button><Button size="sm" variant="ghost" aria-expanded={expanded} onClick={() => setExpandedShowId(expanded ? undefined : entry.showId)}>{expanded ? 'Hide' : 'Details'}</Button></div></td>
                    </tr>
                    {expanded && <tr className="app-post-show-log-detail-row"><td colSpan={6}><table className="app-post-show-log-detail-table" aria-label={`Details for ${entry.artist}`}><tbody><tr><th scope="row">Updated</th><td>{entry.loggedByName || entry.updatedAt || '—'}</td><th scope="row">Show ID</th><td>#{entry.showId}</td></tr><tr><th scope="row">Show notes</th><td colSpan={3}>{entry.showNotes || 'No show notes.'}</td></tr><tr><th scope="row">Post-show notes</th><td colSpan={3}>{entry.postShowNotes || 'No post-show notes yet.'}</td></tr><tr><th scope="row">Incident notes</th><td colSpan={3} data-incident={entry.incident || undefined}>{entry.incidentNotes || 'No incident notes.'}</td></tr></tbody></table></td></tr>}
                  </Fragment>
                );
              })}</tbody>
            </table>
          </div>
        ) : <AppEmptyState title="No post-show logs match those filters." />}
      </Panel>
      <PostShowLogEditorModal entry={editingEntry} isOpen={Boolean(editingEntry)} isSaving={editingEntry ? savingShowId === editingEntry.showId : false} onCancel={() => setEditingShowId(undefined)} onSave={saveEntry} />
    </div>
  );
}
