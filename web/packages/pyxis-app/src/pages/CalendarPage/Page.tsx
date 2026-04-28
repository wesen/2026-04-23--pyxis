import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { useCreateCalendarBlockedMutation, useCreateCalendarHoldMutation, useGetCalendarQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { CalendarBoard } from '../../components/organisms';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

type CalendarDialog = 'hold' | 'blocked' | null;

type CalendarDraft = {
  date: string;
  label: string;
  reason: string;
};

const defaultDraft: CalendarDraft = {
  date: new Date().toISOString().slice(0, 10),
  label: 'Hold — TBD',
  reason: 'Closed',
};

export function CalendarPage() {
  const navigate = useNavigate();
  const { data: events, isLoading, isError } = useGetCalendarQuery();
  const [createHold, holdState] = useCreateCalendarHoldMutation();
  const [createBlocked, blockedState] = useCreateCalendarBlockedMutation();
  const [dialog, setDialog] = useState<CalendarDialog>(null);
  const [draft, setDraft] = useState<CalendarDraft>(defaultDraft);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const openDialog = (next: CalendarDialog) => {
    setDraft(defaultDraft);
    setActionError(undefined);
    setActionSuccess(undefined);
    setDialog(next);
  };

  const submitCalendarDialog = async () => {
    setActionError(undefined); setActionSuccess(undefined);
    if (!draft.date.trim()) { setActionError('Choose a date first.'); return; }
    try {
      if (dialog === 'hold') {
        if (!draft.label.trim()) { setActionError('Add a hold label.'); return; }
        await createHold({ date: draft.date, label: draft.label.trim() }).unwrap();
        setActionSuccess(`Hold created for ${draft.date}.`);
      } else if (dialog === 'blocked') {
        if (!draft.reason.trim()) { setActionError('Add a blocked-date reason.'); return; }
        await createBlocked({ date: draft.date, reason: draft.reason.trim() }).unwrap();
        setActionSuccess(`Blocked date created for ${draft.date}.`);
      }
      setDialog(null);
    } catch {
      setActionError('Could not save this calendar change. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="calendar" title="Calendar" eyebrow="Home / Calendar" subtitle="Plan the room · holds, confirms, and off-nights" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="plus" onClick={() => openDialog('hold')} disabled={holdState.isLoading}>Add hold</Button><Button size="sm" iconLeft="warning" onClick={() => openDialog('blocked')} disabled={blockedState.isLoading}>Block date</Button></div>}>
      {dialog && (
        <section className="app-form-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="calendar-dialog-title">
          <div className="app-form-dialog">
            <header>
              <span className="app-confirm-dialog__eyebrow">Calendar</span>
              <h2 id="calendar-dialog-title">{dialog === 'hold' ? 'Add hold' : 'Block date'}</h2>
              <p>{dialog === 'hold' ? 'Reserve a tentative night while details are still moving.' : 'Mark a night as unavailable for shows.'}</p>
            </header>
            <div className="app-form-grid">
              <label><span>Date</span><input type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} /></label>
              {dialog === 'hold' ? <label><span>Label</span><input value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} /></label> : <label><span>Reason</span><input value={draft.reason} onChange={(event) => setDraft((current) => ({ ...current, reason: event.target.value }))} /></label>}
            </div>
            <footer className="app-detail-actions"><Button variant="ghost" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={submitCalendarDialog} isLoading={holdState.isLoading || blockedState.isLoading}>{dialog === 'hold' ? 'Create hold' : 'Block date'}</Button></footer>
          </div>
        </section>
      )}
      {isLoading ? <LoadingState /> : isError || !events ? <ErrorState /> : events.length === 0 ? <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No holds or blocked dates returned yet." /></> : <><ActionMessages error={actionError} success={actionSuccess} /><CalendarBoard events={events} onOpenShow={(showId) => navigate(`/shows/${showId}`)} onAddToday={() => openDialog('hold')} /></>}
    </AppShell>
  );
}
