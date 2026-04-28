import { Button } from 'pyxis-components';

export type CalendarItemDialogMode = 'hold' | 'blocked';

export type CalendarItemDraft = {
  date: string;
  label: string;
  reason: string;
};

export type CalendarItemDialogProps = {
  mode: CalendarItemDialogMode;
  draft: CalendarItemDraft;
  isSaving?: boolean;
  onChange: (draft: CalendarItemDraft) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function CalendarItemDialog({ mode, draft, isSaving, onChange, onCancel, onSubmit }: CalendarItemDialogProps) {
  return (
    <section className="app-form-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="calendar-dialog-title">
      <div className="app-form-dialog">
        <header><span className="app-confirm-dialog__eyebrow">Calendar</span><h2 id="calendar-dialog-title">{mode === 'hold' ? 'Add hold' : 'Block date'}</h2><p>{mode === 'hold' ? 'Reserve a tentative night while details are still moving.' : 'Mark a night as unavailable for shows.'}</p></header>
        <div className="app-form-grid"><label><span>Date</span><input type="date" value={draft.date} onChange={(event) => onChange({ ...draft, date: event.target.value })} /></label>{mode === 'hold' ? <label><span>Label</span><input value={draft.label} onChange={(event) => onChange({ ...draft, label: event.target.value })} /></label> : <label><span>Reason</span><input value={draft.reason} onChange={(event) => onChange({ ...draft, reason: event.target.value })} /></label>}</div>
        <footer className="app-detail-actions"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={onSubmit} isLoading={isSaving}>{mode === 'hold' ? 'Create hold' : 'Block date'}</Button></footer>
      </div>
    </section>
  );
}
