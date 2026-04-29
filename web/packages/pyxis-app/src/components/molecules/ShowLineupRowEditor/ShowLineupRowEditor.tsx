import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './ShowLineupRowEditor.css';

export type ShowLineupRowDraft = {
  artist: string;
  role: string;
  startTime: string;
  endTime: string;
};

export type ShowLineupRowEditorProps = {
  index: number;
  slot: ShowLineupRowDraft;
  canRemove?: boolean;
  onChange?: (index: number, patch: Partial<ShowLineupRowDraft>) => void;
  onRemove?: (index: number) => void;
};

export function ShowLineupRowEditor({ index, slot, canRemove = true, onChange, onRemove }: ShowLineupRowEditorProps) {
  const rowLabel = `Lineup row ${index + 1}`;

  return (
    <div className="app-show-lineup-row-editor" aria-label={rowLabel} {...appPart('show-lineup-row-editor')}>
      <label className="app-show-lineup-row-editor__field app-show-lineup-row-editor__field--artist">
        <span>Artist / Act <b aria-hidden="true">*</b></span>
        <input value={slot.artist} onChange={(event) => onChange?.(index, { artist: event.target.value })} placeholder="e.g. YOYOYOYO" />
      </label>
      <label className="app-show-lineup-row-editor__field">
        <span>Role</span>
        <input value={slot.role} onChange={(event) => onChange?.(index, { role: event.target.value })} placeholder="Headline" />
      </label>
      <label className="app-show-lineup-row-editor__field">
        <span>Start time</span>
        <input value={slot.startTime} onChange={(event) => onChange?.(index, { startTime: event.target.value })} placeholder="9:00 PM" />
      </label>
      <label className="app-show-lineup-row-editor__field">
        <span>End time</span>
        <input value={slot.endTime} onChange={(event) => onChange?.(index, { endTime: event.target.value })} placeholder="10:00 PM" />
      </label>
      <Button type="button" variant="ghost" size="sm" iconLeft="trash" onClick={() => onRemove?.(index)} disabled={!canRemove} aria-label={`Remove ${rowLabel}`}>Remove</Button>
    </div>
  );
}
