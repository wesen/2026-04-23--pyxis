import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'pyxis-components';
import type { ShowLogEntry, ShowLogUpdateInput } from '../../../../api/appApi';
import { FieldError } from '../../../molecules/FieldError';
import { appPart } from '../../../parts';
import './PostShowLogEditorModal.css';

type Draft = Pick<ShowLogUpdateInput, 'draw' | 'postShowNotes' | 'incident' | 'incidentNotes'> & {
  quickHighlight: string;
  totalDoor: string;
};

const MAX_NOTE_LENGTH = 1000;
const MAX_HIGHLIGHT_LENGTH = 160;

export type PostShowLogEditorModalProps = {
  entry?: ShowLogEntry;
  isOpen: boolean;
  isSaving?: boolean;
  onCancel: () => void;
  onSave?: (update: ShowLogUpdateInput) => void;
};

function formatDoorCents(cents?: number) {
  if (cents == null) return '';
  return (cents / 100).toFixed(2);
}

function parseDoorCents(value: string) {
  const trimmed = value.trim().replace(/^\$/, '');
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.round(parsed * 100);
}

function draftFromEntry(entry?: ShowLogEntry): Draft {
  return {
    draw: entry?.draw ?? 0,
    postShowNotes: entry?.postShowNotes ?? '',
    incident: entry?.incident ?? false,
    incidentNotes: entry?.incidentNotes ?? '',
    quickHighlight: entry?.quickHighlight ?? '',
    totalDoor: formatDoorCents(entry?.totalDoorCents),
  };
}

function formatDate(date?: string) {
  if (!date) return 'Unscheduled';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function InfoIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden><circle cx="10" cy="10" r="8" /><path d="M10 9v5" /><path d="M10 6.3h.01" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden><path d="M10 2.8 16 5v4.6c0 3.6-2.4 6.5-6 7.7-3.6-1.2-6-4.1-6-7.7V5l6-2.2Z" /></svg>;
}

function FieldShell({ label, help, children, className }: { label: string; help?: string; children: ReactNode; className?: string }) {
  return <label className={['app-post-show-log-modal__field', className].filter(Boolean).join(' ')}><span className="app-post-show-log-modal__label">{label}</span>{help && <span className="app-post-show-log-modal__help">{help}</span>}{children}</label>;
}

function TextAreaWithCount({ value, onChange, placeholder, rows = 3, invalid }: { value: string; onChange: (value: string) => void; placeholder: string; rows?: number; invalid?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 260)}px`;
  }, [value]);

  return <div className="app-post-show-log-modal__textarea-wrap"><textarea ref={ref} className="app-post-show-log-modal__textarea" rows={rows} maxLength={MAX_NOTE_LENGTH} value={value} aria-invalid={invalid} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /><span className="app-post-show-log-modal__counter">{value.length} / {MAX_NOTE_LENGTH}</span></div>;
}

export function PostShowLogEditorModal({ entry, isOpen, isSaving, onCancel, onSave }: PostShowLogEditorModalProps) {
  const [draft, setDraft] = useState<Draft>(() => draftFromEntry(entry));

  useEffect(() => {
    if (isOpen) setDraft(draftFromEntry(entry));
  }, [entry, isOpen]);

  const validationError = useMemo(() => {
    if ((draft.draw ?? 0) < 0) return 'Draw cannot be negative.';
    if ((draft.draw ?? 0) > 10000) return 'Draw looks too high. Double-check before saving.';
    const totalDoorCents = parseDoorCents(draft.totalDoor);
    if (draft.totalDoor.trim() && totalDoorCents == null) return 'Total door must be a valid dollar amount.';
    if (totalDoorCents != null && totalDoorCents < 0) return 'Total door cannot be negative.';
    if (draft.incident && !draft.incidentNotes?.trim()) return 'Incident notes are required when Incident is checked.';
    return undefined;
  }, [draft]);

  const save = () => {
    if (!entry) return;
    onSave?.({
      showId: entry.showId,
      draw: draft.draw,
      postShowNotes: draft.postShowNotes,
      quickHighlight: draft.quickHighlight,
      totalDoorCents: parseDoorCents(draft.totalDoor),
      incident: draft.incident,
      incidentNotes: draft.incidentNotes,
    });
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(entry)}
      onClose={onCancel}
      title={entry ? `Log show — ${entry.artist}` : 'Post-show log'}
      subtitle={entry ? `${formatDate(entry.date)} · ${entry.genre || 'Genre not set'}` : undefined}
      width={draft.incident ? 'xl' : 'lg'}
      bodyClassName="app-post-show-log-modal__body"
      panelClassName="app-post-show-log-modal__panel"
      footerClassName="app-post-show-log-modal__footer"
      panelProps={{ ...appPart('post-show-log-editor-modal') } as HTMLAttributes<HTMLDivElement>}
      footer={<><Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button><Button variant="danger" size="sm" isLoading={isSaving} disabled={Boolean(validationError) || !entry} onClick={save}>Save post-show log</Button></>}
    >
      {entry && <div className="app-post-show-log-modal__layout" data-incident={draft.incident ? 'true' : 'false'}>
        <main className="app-post-show-log-modal__main-column" aria-label="Post-show report fields">
          <section className="app-post-show-log-modal__pre-show-note" aria-label="Pre-show note">
            <span className="app-post-show-log-modal__callout-icon"><InfoIcon /></span>
            <div><h3>Pre-show note</h3><p>{entry.showNotes || 'No pre-show note was attached before the show.'}</p></div>
          </section>

          <FieldShell label="Quick highlight" help="In one sentence, what was memorable about this show?">
            <input className="app-post-show-log-modal__input" maxLength={MAX_HIGHLIGHT_LENGTH} value={draft.quickHighlight} placeholder="e.g. Great crowd, strong energy start to finish." onChange={(event) => setDraft((current) => ({ ...current, quickHighlight: event.target.value }))} />
          </FieldShell>

          <div className="app-post-show-log-modal__metrics-grid">
            <FieldShell label="Draw (attendance)" help="Number of people in attendance">
              <input className="app-post-show-log-modal__input" type="number" min={0} max={10000} value={draft.draw ?? 0} placeholder="e.g. 312" aria-invalid={(draft.draw ?? 0) < 0 || (draft.draw ?? 0) > 10000} onChange={(event) => setDraft((current) => ({ ...current, draw: Number(event.target.value) }))} />
            </FieldShell>
            <FieldShell label="Total door" help="Total dollars collected at the door">
              <span className="app-post-show-log-modal__currency-input"><span>$</span><input inputMode="decimal" value={draft.totalDoor} placeholder="e.g. 745.00" onChange={(event) => setDraft((current) => ({ ...current, totalDoor: event.target.value }))} /></span>
            </FieldShell>
          </div>

          <label className="app-post-show-log-modal__checkbox">
            <input type="checkbox" checked={draft.incident} onChange={(event) => setDraft((current) => ({ ...current, incident: event.target.checked, incidentNotes: event.target.checked ? current.incidentNotes : '' }))} />
            <span><strong>Mark this show as having an incident</strong><small>You'll be able to add details in the staff-only panel.</small></span>
          </label>

          <div className="app-post-show-log-modal__rule" />

          <FieldShell label="Post-show notes" help="What happened before, during, and after the show?">
            <TextAreaWithCount value={draft.postShowNotes ?? ''} placeholder="Add details..." onChange={(value) => setDraft((current) => ({ ...current, postShowNotes: value }))} />
          </FieldShell>
          <FieldError>{validationError}</FieldError>
        </main>

        {draft.incident && <aside className="app-post-show-log-modal__side-column" aria-label="Incident details and privacy">
          <section className="app-post-show-log-modal__incident-panel">
            <h3>Incident details</h3>
            <p>Provide details about what occurred.</p>
            <TextAreaWithCount invalid={Boolean(!draft.incidentNotes?.trim())} value={draft.incidentNotes ?? ''} placeholder="Describe the incident..." onChange={(value) => setDraft((current) => ({ ...current, incidentNotes: value }))} />
          </section>
          <section className="app-post-show-log-modal__privacy-banner" aria-label="Incident privacy note">
            <span className="app-post-show-log-modal__privacy-icon"><ShieldIcon /></span>
            <p><strong>Incident logs are private and staff-only.</strong><span>They are not visible on the public show page.</span></p>
          </section>
        </aside>}
      </div>}
    </Modal>
  );
}
