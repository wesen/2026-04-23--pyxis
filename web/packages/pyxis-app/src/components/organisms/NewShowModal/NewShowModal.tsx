import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'pyxis-components';
import { create, ShowSchema, ShowStatus, type Show } from 'pyxis-types';
import { FlyerDropzone } from '../../molecules/FlyerDropzone';
import { ShowFormSection } from '../../molecules/ShowFormSection';
import { ShowLineupRowEditor, type ShowLineupRowDraft } from '../../molecules/ShowLineupRowEditor';
import { appPart } from '../../parts';
import './NewShowModal.css';

type LineupDraft = ShowLineupRowDraft;

type ShowDraft = {
  artist: string;
  date: string;
  doorsTime: string;
  startTime: string;
  age: string;
  price: string;
  reserveTicketEnabled: boolean;
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
  reserveTicketEnabled: false,
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
    reserveTicketEnabled: show.reserveTicketEnabled,
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

  const title = mode === 'create' ? 'Create show' : 'Edit show';
  const description = mode === 'create'
    ? 'Add the details for your show and share it with your audience.'
    : 'Update show details, lineup, staff notes, and assets.';
  const hasFlyerForConfirmation = Boolean(initialShow?.flyerUrl || flyerFile);

  const update = <K extends keyof ShowDraft>(key: K, value: ShowDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateLineup = (index: number, patch: Partial<LineupDraft>) => setDraft((current) => ({
    ...current,
    lineup: current.lineup.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
  }));
  const addLineup = () => setDraft((current) => ({ ...current, lineup: [...current.lineup, { artist: '', role: 'support', startTime: '', endTime: '' }] }));
  const removeLineup = (index: number) => setDraft((current) => ({ ...current, lineup: current.lineup.length > 1 ? current.lineup.filter((_entry, i) => i !== index) : current.lineup }));

  const submit = (status = draft.status) => {
    setValidationError(undefined);
    if (!draft.artist.trim()) { setValidationError('Artist / act name is required.'); return; }
    if (status !== ShowStatus.DRAFT && !draft.date) { setValidationError('Date is required before saving a non-draft show.'); return; }
    if (status === ShowStatus.CONFIRMED && !hasFlyerForConfirmation) { setValidationError('Confirmed shows require an uploaded flyer. Save as draft/hold until poster artwork is attached.'); return; }
    if (draft.capacity < 0) { setValidationError('Capacity cannot be negative.'); return; }
    const show = create(ShowSchema, {
      id: initialShow?.id ?? 0,
      artist: draft.artist.trim(),
      date: draft.date,
      doorsTime: draft.doorsTime,
      startTime: draft.startTime,
      age: draft.age,
      price: draft.price,
      reserveTicketEnabled: draft.reserveTicketEnabled,
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
          <Button onClick={() => submit(draft.status)} isLoading={isSaving}>{mode === 'create' ? 'Create show' : 'Save show'}</Button>
        </>
      }
    >
      <div className="app-new-show-modal-form" {...appPart('new-show-modal', 'form')}>
        {(error || validationError) && <div className="app-new-show-modal-error" role="alert">{error || validationError}</div>}

        <ShowFormSection title="Basics" description="Core public information. Fields marked * are required for confirmed shows.">
          <label className="app-new-show-modal-field app-new-show-modal-field--full">
            <span>Artist / act name <b aria-hidden="true">*</b></span>
            <input required value={draft.artist} onChange={(event) => update('artist', event.target.value)} placeholder="e.g. Foobar" />
          </label>
          <label className="app-new-show-modal-field app-new-show-modal-field--full">
            <span>Public description</span>
            <textarea rows={3} value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="Tell people about the show..." />
          </label>
        </ShowFormSection>

        <ShowFormSection title="Date & time">
          <div className="app-new-show-modal-grid cols-3">
            <label className="app-new-show-modal-field">
              <span>Date <b aria-hidden="true">*</b></span>
              <input type="date" required={draft.status !== ShowStatus.DRAFT} value={draft.date} onChange={(event) => update('date', event.target.value)} />
            </label>
            <label className="app-new-show-modal-field">
              <span>Doors</span>
              <input value={draft.doorsTime} onChange={(event) => update('doorsTime', event.target.value)} placeholder="8:00 PM" />
            </label>
            <label className="app-new-show-modal-field">
              <span>Show starts</span>
              <input value={draft.startTime} onChange={(event) => update('startTime', event.target.value)} placeholder="9:00 PM" />
            </label>
          </div>
        </ShowFormSection>

        <ShowFormSection title="Details" description="Price is optional display text. The public reserve CTA is controlled by the checkbox.">
          <div className="app-new-show-modal-grid cols-4">
            <label className="app-new-show-modal-field">
              <span>Age restriction</span>
              <select value={draft.age} onChange={(event) => update('age', event.target.value)}>
                <option>All Ages</option>
                <option>18+</option>
                <option>21+</option>
              </select>
            </label>
            <label className="app-new-show-modal-field">
              <span>Price</span>
              <input value={draft.price} onChange={(event) => update('price', event.target.value)} placeholder="Optional display text" />
            </label>
            <label className="app-new-show-modal-field">
              <span>Capacity</span>
              <input type="number" min="0" value={draft.capacity} onChange={(event) => update('capacity', Number(event.target.value))} />
            </label>
            <label className="app-new-show-modal-field">
              <span>Genre</span>
              <input value={draft.genre} onChange={(event) => update('genre', event.target.value)} placeholder="e.g. Electronic" />
            </label>
          </div>
          <label className="app-new-show-modal-field">
            <span>Status</span>
            <select value={draft.status} onChange={(event) => update('status', Number(event.target.value) as ShowStatus)}>
              <option value={ShowStatus.CONFIRMED} disabled={!hasFlyerForConfirmation}>Confirmed{hasFlyerForConfirmation ? '' : ' — needs flyer'}</option>
              <option value={ShowStatus.HOLD}>Hold</option>
              <option value={ShowStatus.DRAFT}>Draft</option>
              <option value={ShowStatus.ARCHIVED}>Archived</option>
            </select>
          </label>
          <label className="app-new-show-modal-toggle">
            <input type="checkbox" checked={draft.reserveTicketEnabled} onChange={(event) => update('reserveTicketEnabled', event.target.checked)} />
            <span>Show “Reserve ticket” call-to-action publicly</span>
          </label>
          <p className="app-new-show-modal-help">Save draft keeps the show staff-only and lists it under Shows → Drafts. Blank price means no public price/reserve copy yet.</p>
          {!hasFlyerForConfirmation && <p className="app-new-show-modal-warning">Confirmed shows need a flyer/poster before they can appear publicly. Attach a flyer here or save as Draft/Hold until artwork is ready.</p>}
        </ShowFormSection>

        <ShowFormSection title="Lineup" description="Add artists, roles, and rough set times." action={<Button type="button" variant="outline" size="sm" iconLeft="plus" onClick={addLineup}>Add time slot</Button>}>
          <div className="app-new-show-modal-lineup-list">
            {draft.lineup.map((entry, index) => (
              <ShowLineupRowEditor
                key={index}
                index={index}
                slot={entry}
                canRemove={draft.lineup.length > 1}
                onChange={updateLineup}
                onRemove={removeLineup}
              />
            ))}
          </div>
        </ShowFormSection>

        <ShowFormSection title="Additional info">
          <label className="app-new-show-modal-field app-new-show-modal-field--full">
            <span>Staff notes</span>
            <textarea rows={3} value={draft.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Visible to staff only..." />
            <small>Visible to staff only</small>
          </label>
        </ShowFormSection>

        <ShowFormSection title="Flyer" description="Upload a flyer for the show. Recommended 1080×1080 or 1080×1350.">
          <FlyerDropzone currentUrl={initialShow?.flyerUrl} file={flyerFile} disabled={isSaving} onFileChange={setFlyerFile} />
        </ShowFormSection>
      </div>
    </Modal>
  );
}
