import { useEffect, useMemo, useState } from 'react';
import { Button } from 'pyxis-components';
import type { ShowLogEntry, ShowLogUpdateInput } from '../../../../api/appApi';
import { AppCard } from '../../../molecules/AppCard';
import { FieldError } from '../../../molecules/FieldError';
import { MetadataStrip } from '../../../molecules/MetadataStrip';
import { NoteBlock } from '../../../molecules/NoteBlock';
import { StatusBadge, type StatusBadgeTone } from '../../../molecules/StatusBadge';
import { appPart } from '../../../parts';
import './PostShowLogEntryCard.css';

export type PostShowLogDraft = Pick<ShowLogUpdateInput, 'draw' | 'postShowNotes' | 'incident' | 'incidentNotes'>;

export type PostShowLogEntryCardProps = {
  entry: ShowLogEntry;
  expanded?: boolean;
  isSaving?: boolean;
  onToggleExpanded?: (showId: number) => void;
  onCancel?: (showId: number) => void;
  onSave?: (update: ShowLogUpdateInput) => void;
};

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

function cardTone(entry: ShowLogEntry) {
  if (entry.logStatus === 'incident') return 'danger' as const;
  if (entry.logStatus === 'logged') return 'success' as const;
  return 'warning' as const;
}

function formatDate(date: string) {
  if (!date) return 'Unscheduled';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function createDraft(entry: ShowLogEntry): PostShowLogDraft {
  return {
    draw: entry.draw ?? 0,
    postShowNotes: entry.postShowNotes ?? '',
    incident: entry.incident,
    incidentNotes: entry.incidentNotes ?? '',
  };
}

export function PostShowLogEntryCard({ entry, expanded = false, isSaving = false, onToggleExpanded, onCancel, onSave }: PostShowLogEntryCardProps) {
  const [draft, setDraft] = useState<PostShowLogDraft>(() => createDraft(entry));

  useEffect(() => {
    setDraft(createDraft(entry));
  }, [entry]);

  const validationError = useMemo(() => {
    if ((draft.draw ?? 0) < 0) return 'Draw cannot be negative.';
    if ((draft.draw ?? 0) > 10000) return 'Draw looks too high. Double-check before saving.';
    if (draft.incident && !draft.incidentNotes?.trim()) return 'Incident notes are required when Incident is checked.';
    return undefined;
  }, [draft]);

  const actionLabel = entry.logStatus === 'needs-log' ? 'Log show' : entry.logStatus === 'incident' ? 'Review log' : 'Edit log';

  return (
    <AppCard className="app-post-show-log-card" tone={cardTone(entry)} {...appPart('post-show-log-entry-card')}>
      <div className="app-post-show-log-card__header" {...appPart('post-show-log-entry-card', 'header')}>
        <StatusBadge label={statusLabel(entry)} tone={statusTone(entry)} />
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </div>

      <div className="app-post-show-log-card__identity" {...appPart('post-show-log-entry-card', 'identity')}>
        <h3>{entry.artist}</h3>
        <p>{entry.genre || 'Genre not set'}</p>
      </div>

      <MetadataStrip
        items={[
          { label: 'Draw', value: entry.draw && entry.draw > 0 ? entry.draw : '—', tone: entry.draw && entry.draw > 0 ? 'default' : 'muted' },
          { label: 'Incident', value: entry.incident ? 'Yes' : 'No', tone: entry.incident ? 'danger' : 'default' },
          { label: 'Updated', value: entry.loggedByName || entry.updatedAt || '—', tone: entry.updatedAt ? 'default' : 'muted' },
        ]}
      />

      {!expanded && entry.showNotes ? <NoteBlock label="Show notes" value={entry.showNotes} tone="muted" /> : null}
      {!expanded && entry.postShowNotes ? <NoteBlock label="Post-show notes" value={entry.postShowNotes} /> : null}
      {!expanded && entry.incidentNotes ? <NoteBlock label="Incident notes" value={entry.incidentNotes} tone="danger" /> : null}

      {expanded ? (
        <div className="app-post-show-log-card__editor" {...appPart('post-show-log-entry-card', 'editor')}>
          <NoteBlock label="Show notes" value={entry.showNotes} empty="No show notes were attached before the show." tone="muted" />
          <div className="app-post-show-log-card__form-grid">
            <label>
              <span>Draw</span>
              <input type="number" min={0} max={10000} value={draft.draw ?? 0} aria-invalid={(draft.draw ?? 0) < 0 || (draft.draw ?? 0) > 10000} onChange={(event) => setDraft((current) => ({ ...current, draw: Number(event.target.value) }))} />
            </label>
            <label className="app-post-show-log-card__checkbox">
              <input type="checkbox" checked={draft.incident} onChange={(event) => setDraft((current) => ({ ...current, incident: event.target.checked, incidentNotes: event.target.checked ? current.incidentNotes : '' }))} />
              <span>Mark this show as having an incident</span>
            </label>
            <label className="app-post-show-log-card__wide">
              <span>Post-show notes</span>
              <textarea rows={4} value={draft.postShowNotes ?? ''} onChange={(event) => setDraft((current) => ({ ...current, postShowNotes: event.target.value }))} />
            </label>
            <label className="app-post-show-log-card__wide">
              <span>Incident notes</span>
              <textarea rows={3} disabled={!draft.incident} aria-invalid={Boolean(draft.incident && !draft.incidentNotes?.trim())} value={draft.incidentNotes ?? ''} onChange={(event) => setDraft((current) => ({ ...current, incidentNotes: event.target.value }))} />
            </label>
          </div>
          <FieldError>{validationError}</FieldError>
          <div className="app-post-show-log-card__actions">
            <Button size="sm" variant="ghost" onClick={() => onCancel?.(entry.showId)}>Cancel</Button>
            <Button size="sm" isLoading={isSaving} disabled={Boolean(validationError)} onClick={() => onSave?.({ showId: entry.showId, ...draft })}>Save post-show log</Button>
          </div>
        </div>
      ) : (
        <div className="app-post-show-log-card__actions">
          <Button size="sm" variant="outline" onClick={() => onToggleExpanded?.(entry.showId)}>{actionLabel}</Button>
        </div>
      )}
    </AppCard>
  );
}
