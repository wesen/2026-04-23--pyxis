import { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'pyxis-components';
import type { ShowLogEntry, ShowLogUpdateInput } from '../../../../api/appApi';
import { FieldError } from '../../../molecules/FieldError';
import { NoteBlock } from '../../../molecules/NoteBlock';
import './PostShowLogPanel.css';

type Draft = Pick<ShowLogUpdateInput, 'draw' | 'postShowNotes' | 'incident' | 'incidentNotes'>;

export type PostShowLogEditorModalProps = {
  entry?: ShowLogEntry;
  isOpen: boolean;
  isSaving?: boolean;
  onCancel: () => void;
  onSave?: (update: ShowLogUpdateInput) => void;
};

function draftFromEntry(entry?: ShowLogEntry): Draft {
  return { draw: entry?.draw ?? 0, postShowNotes: entry?.postShowNotes ?? '', incident: entry?.incident ?? false, incidentNotes: entry?.incidentNotes ?? '' };
}

function formatDate(date?: string) {
  if (!date) return 'Unscheduled';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function PostShowLogEditorModal({ entry, isOpen, isSaving, onCancel, onSave }: PostShowLogEditorModalProps) {
  const [draft, setDraft] = useState<Draft>(() => draftFromEntry(entry));

  useEffect(() => {
    if (isOpen) setDraft(draftFromEntry(entry));
  }, [entry, isOpen]);

  const validationError = useMemo(() => {
    if ((draft.draw ?? 0) < 0) return 'Draw cannot be negative.';
    if ((draft.draw ?? 0) > 10000) return 'Draw looks too high. Double-check before saving.';
    if (draft.incident && !draft.incidentNotes?.trim()) return 'Incident notes are required when Incident is checked.';
    return undefined;
  }, [draft]);

  return (
    <Modal
      isOpen={isOpen && Boolean(entry)}
      onClose={onCancel}
      title={entry ? `${entry.logStatus === 'needs-log' ? 'Log show' : 'Edit post-show log'} — ${entry.artist}` : 'Post-show log'}
      subtitle={entry ? `${formatDate(entry.date)} · ${entry.genre || 'Genre not set'}` : undefined}
      width="lg"
      bodyClassName="app-post-show-log-modal__body"
      footer={<><Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button><Button size="sm" isLoading={isSaving} disabled={Boolean(validationError) || !entry} onClick={() => entry && onSave?.({ showId: entry.showId, ...draft })}>Save post-show log</Button></>}
    >
      {entry && <div className="app-post-show-log-modal__content">
        <NoteBlock label="Show notes" value={entry.showNotes} empty="No show notes were attached before the show." tone="muted" />
        <div className="app-post-show-log-modal__grid">
          <label>
            <span>Draw</span>
            <input type="number" min={0} max={10000} value={draft.draw ?? 0} aria-invalid={(draft.draw ?? 0) < 0 || (draft.draw ?? 0) > 10000} onChange={(event) => setDraft((current) => ({ ...current, draw: Number(event.target.value) }))} />
          </label>
          <label className="app-post-show-log-modal__checkbox">
            <input type="checkbox" checked={draft.incident} onChange={(event) => setDraft((current) => ({ ...current, incident: event.target.checked, incidentNotes: event.target.checked ? current.incidentNotes : '' }))} />
            <span>Mark this show as having an incident</span>
          </label>
          <label className="app-post-show-log-modal__wide">
            <span>Post-show notes</span>
            <textarea rows={5} value={draft.postShowNotes ?? ''} onChange={(event) => setDraft((current) => ({ ...current, postShowNotes: event.target.value }))} />
          </label>
          <label className="app-post-show-log-modal__wide">
            <span>Incident notes</span>
            <textarea rows={4} disabled={!draft.incident} aria-invalid={Boolean(draft.incident && !draft.incidentNotes?.trim())} value={draft.incidentNotes ?? ''} onChange={(event) => setDraft((current) => ({ ...current, incidentNotes: event.target.value }))} />
          </label>
        </div>
        <FieldError>{validationError}</FieldError>
      </div>}
    </Modal>
  );
}
