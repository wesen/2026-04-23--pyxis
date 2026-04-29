import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'pyxis-components';
import { create, ShowSchema, ShowStatus, type Show } from 'pyxis-types';
import { appPart } from '../../parts';
import './NewShowModal.css';

type LineupDraft = {
  artist: string;
  role: string;
  startTime: string;
  endTime: string;
};

type ShowDraft = {
  artist: string;
  date: string;
  doorsTime: string;
  startTime: string;
  age: string;
  price: string;
  genre: string;
  description: string;
  notes: string;
  capacity: number;
  status: ShowStatus;
  lineup: LineupDraft[];
};

export type NewShowModalProps = {
  isOpen?: boolean;
  mode?: 'create' | 'edit';
  initialShow?: Show;
  isSaving?: boolean;
  error?: string;
  onCancel?: () => void;
  onSubmit?: (show: Show, flyerFile?: File) => void;
};

const emptyDraft: ShowDraft = {
  artist: '',
  date: '',
  doorsTime: '8:00 PM',
  startTime: '9:00 PM',
  age: '21+',
  price: '',
  genre: '',
  description: '',
  notes: '',
  capacity: 150,
  status: ShowStatus.CONFIRMED,
  lineup: [{ artist: '', role: 'headline', startTime: '9:00 PM', endTime: '' }],
};

function draftFromShow(show?: Show): ShowDraft {
  if (!show) return emptyDraft;
  return {
    artist: show.artist,
    date: show.date,
    doorsTime: show.doorsTime,
    startTime: show.startTime,
    age: show.age,
    price: show.price,
    genre: show.genre,
    description: show.description,
    notes: show.notes,
    capacity: show.capacity || 150,
    status: show.status || ShowStatus.CONFIRMED,
    lineup: show.lineup.length > 0
      ? show.lineup.map((entry) => ({ artist: entry.artist, role: entry.role, startTime: entry.startTime, endTime: entry.endTime }))
      : [{ artist: show.artist, role: 'headline', startTime: show.startTime, endTime: '' }],
  };
}

export function NewShowModal({
  isOpen = true,
  mode = 'create',
  initialShow,
  isSaving,
  error,
  onCancel,
  onSubmit,
}: NewShowModalProps) {
  const [draft, setDraft] = useState<ShowDraft>(() => draftFromShow(initialShow));
  const [flyerFile, setFlyerFile] = useState<File | undefined>();
  const [validationError, setValidationError] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      setDraft(draftFromShow(initialShow));
      setFlyerFile(undefined);
      setValidationError(undefined);
    }
  }, [initialShow, isOpen]);

  const title = mode === 'create' ? 'Add new show' : 'Edit show';
  const description = mode === 'create' ? 'Create a show record and lineup. Fields marked * are required for confirmed shows.' : 'Update show details and replace the lineup. Fields marked * are required for confirmed shows.';

  const update = <K extends keyof ShowDraft>(key: K, value: ShowDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateLineup = (index: number, patch: Partial<LineupDraft>) => setDraft((current) => ({
    ...current,
    lineup: current.lineup.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
  }));
  const addLineup = () => setDraft((current) => ({ ...current, lineup: [...current.lineup, { artist: '', role: 'support', startTime: '', endTime: '' }] }));
  const removeLineup = (index: number) => setDraft((current) => ({ ...current, lineup: current.lineup.filter((_entry, i) => i !== index) }));

  const submit = (status = draft.status) => {
    setValidationError(undefined);
    if (!draft.artist.trim()) { setValidationError('Artist / act name is required.'); return; }
    if (status !== ShowStatus.DRAFT && !draft.date) { setValidationError('Date is required before saving a non-draft show.'); return; }
    if (draft.capacity < 0) { setValidationError('Capacity cannot be negative.'); return; }
    const show = create(ShowSchema, {
      id: initialShow?.id ?? 0,
      artist: draft.artist.trim(),
      date: draft.date,
      doorsTime: draft.doorsTime,
      startTime: draft.startTime,
      age: draft.age,
      price: draft.price,
      genre: draft.genre,
      description: draft.description,
      notes: draft.notes,
      capacity: Number(draft.capacity) || 0,
      status,
      lineup: draft.lineup
        .filter((entry) => entry.artist.trim())
        .map((entry) => ({ artist: entry.artist.trim(), role: entry.role || 'support', startTime: entry.startTime, endTime: entry.endTime })),
    });
    onSubmit?.(show, flyerFile);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onCancel?.()}
      title={title}
      subtitle={description}
      width="lg"
      className="app-new-show-modal-shell"
      panelClassName="app-new-show-modal"
      bodyClassName="app-new-show-modal-body"
      footerClassName="app-new-show-modal-footer"
      panelProps={appPart('new-show-modal') as HTMLAttributes<HTMLDivElement>}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button variant="outline" onClick={() => submit(ShowStatus.DRAFT)} isLoading={isSaving} title="Drafts stay staff-only and appear under Shows → Drafts.">Save draft</Button>
          <Button onClick={() => submit(draft.status)} isLoading={isSaving}>Save show</Button>
        </>
      }
    >
      <div className="app-new-show-modal-form">
        {(error || validationError) && <div className="app-new-show-modal-error" role="alert">{error || validationError}</div>}
        <label className="app-new-show-modal-field">
          <span>Artist / act name *</span>
          <input required value={draft.artist} onChange={(event) => update('artist', event.target.value)} />
        </label>
        <div className="app-new-show-modal-grid cols-4">
          <label className="app-new-show-modal-field">
            <span>Date *</span>
            <input type="date" required={draft.status !== ShowStatus.DRAFT} value={draft.date} onChange={(event) => update('date', event.target.value)} />
          </label>
          <label className="app-new-show-modal-field">
            <span>Doors</span>
            <input value={draft.doorsTime} onChange={(event) => update('doorsTime', event.target.value)} />
          </label>
          <label className="app-new-show-modal-field">
            <span>Start</span>
            <input value={draft.startTime} onChange={(event) => update('startTime', event.target.value)} />
          </label>
          <label className="app-new-show-modal-field">
            <span>Status</span>
            <select value={draft.status} onChange={(event) => update('status', Number(event.target.value) as ShowStatus)}>
              <option value={ShowStatus.CONFIRMED}>Confirmed</option>
              <option value={ShowStatus.HOLD}>Hold</option>
              <option value={ShowStatus.DRAFT}>Draft</option>
              <option value={ShowStatus.ARCHIVED}>Archived</option>
            </select>
          </label>
        </div>
        <div className="app-new-show-modal-grid cols-4">
          <label className="app-new-show-modal-field">
            <span>Age</span>
            <select value={draft.age} onChange={(event) => update('age', event.target.value)}>
              <option>All Ages</option>
              <option>18+</option>
              <option>21+</option>
            </select>
          </label>
          <label className="app-new-show-modal-field">
            <span>Reserve ticket / price</span>
            <input value={draft.price} onChange={(event) => update('price', event.target.value)} placeholder="Optional" />
          </label>
          <label className="app-new-show-modal-field">
            <span>Genre</span>
            <input value={draft.genre} onChange={(event) => update('genre', event.target.value)} />
          </label>
          <label className="app-new-show-modal-field">
            <span>Capacity</span>
            <input type="number" min="0" value={draft.capacity} onChange={(event) => update('capacity', Number(event.target.value))} />
          </label>
        </div>
        <label className="app-new-show-modal-field">
          <span>Public description</span>
          <textarea rows={3} value={draft.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <label className="app-new-show-modal-field">
          <span>Staff notes</span>
          <textarea rows={2} value={draft.notes} onChange={(event) => update('notes', event.target.value)} />
          <small>Visible to staff only</small>
        </label>
        <p className="app-new-show-modal-help">Save draft keeps the show staff-only and lists it under Shows → Drafts. Reserve ticket / price is optional; leave it blank when there is no advance/reservation copy yet.</p>
        <div className="app-new-show-modal-lineup">
          <div className="app-new-show-modal-section-header">
            <span>Lineup</span>
            <Button type="button" variant="outline" size="sm" iconLeft="plus" onClick={addLineup}>Add row</Button>
          </div>
          {draft.lineup.map((entry, index) => (
            <div className="app-new-show-modal-lineup-row" key={index}>
              <label className="app-new-show-modal-field"><span>Artist</span><input value={entry.artist} onChange={(event) => updateLineup(index, { artist: event.target.value })} /></label>
              <label className="app-new-show-modal-field"><span>Role</span><input value={entry.role} onChange={(event) => updateLineup(index, { role: event.target.value })} /></label>
              <label className="app-new-show-modal-field"><span>Start</span><input value={entry.startTime} onChange={(event) => updateLineup(index, { startTime: event.target.value })} /></label>
              <label className="app-new-show-modal-field"><span>End</span><input value={entry.endTime} onChange={(event) => updateLineup(index, { endTime: event.target.value })} /></label>
              <Button type="button" variant="ghost" size="sm" iconLeft="trash" onClick={() => removeLineup(index)} aria-label="Remove lineup row">Remove</Button>
            </div>
          ))}
        </div>
        <label className="app-new-show-modal-field">
          <span>Flyer</span>
          <input type="file" accept="image/*,.pdf" onChange={(event) => setFlyerFile(event.target.files?.[0])} />
          {initialShow?.flyerUrl && <small>Current flyer: {initialShow.flyerUrl}</small>}
          {flyerFile && <small>Selected: {flyerFile.name}</small>}
        </label>
      </div>
    </Modal>
  );
}
