import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { CalendarEventKind, create, ShowSchema, ShowStatus, type CalendarEvent } from 'pyxis-types';
import { useCreateCalendarBlockedMutation, useCreateCalendarHoldMutation, useCreateShowMutation, useDeleteCalendarBlockedMutation, useDeleteCalendarHoldMutation, useGetCalendarQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { CalendarBoard, CalendarDayInspector, CalendarItemDialog, ConfirmDialog, NewShowModal } from '../../components/organisms';
import { ActionMessages, ErrorState, LoadingState } from '../shared';
import './Page.css';

type CalendarDialog = 'hold' | 'blocked' | 'show' | null;
type DeleteTarget = CalendarEvent | null;

type CalendarDraft = { date: string; label: string; reason: string; };
const todayISO = () => new Date().toISOString().slice(0, 10);
const defaultDraft = (date = todayISO()): CalendarDraft => ({ date, label: 'Hold — TBD', reason: 'Closed' });
const monthLabel = (year: number, monthIndex: number) => new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export function CalendarPage() {
  const navigate = useNavigate();
  const { data: events, isLoading, isError } = useGetCalendarQuery();
  const [createHold, holdState] = useCreateCalendarHoldMutation();
  const [createBlocked, blockedState] = useCreateCalendarBlockedMutation();
  const [deleteHold, deleteHoldState] = useDeleteCalendarHoldMutation();
  const [deleteBlocked, deleteBlockedState] = useDeleteCalendarBlockedMutation();
  const [createShow, createShowState] = useCreateShowMutation();
  const [visibleMonth, setVisibleMonth] = useState(() => { const now = new Date(); return { year: now.getFullYear(), monthIndex: now.getMonth() }; });
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [dialog, setDialog] = useState<CalendarDialog>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [draft, setDraft] = useState<CalendarDraft>(defaultDraft());
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const openDialog = (next: CalendarDialog, date = selectedDate) => { setDraft(defaultDraft(date)); setActionError(undefined); setActionSuccess(undefined); setDialog(next); };
  const jumpMonth = (delta: number) => setVisibleMonth((current) => { const next = new Date(current.year, current.monthIndex + delta, 1); return { year: next.getFullYear(), monthIndex: next.getMonth() }; });
  const jumpToday = () => { const now = new Date(); const date = todayISO(); setVisibleMonth({ year: now.getFullYear(), monthIndex: now.getMonth() }); setSelectedDate(date); };

  const selectedEvents = useMemo(() => (events ?? []).filter((event) => event.date === selectedDate), [events, selectedDate]);

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
    } catch { setActionError('Could not save this calendar change. Check your session and backend logs.'); }
  };

  const handleCreateShow = async (show: Parameters<typeof createShow>[0], flyerFile?: File) => {
    setActionError(undefined); setActionSuccess(undefined);
    try {
      const created = await createShow(show).unwrap();
      setDialog(null);
      setActionSuccess(`Show #${created.id} created for ${show.date}.`);
      if (flyerFile) setActionSuccess(`Show #${created.id} created. Add flyer from the show detail page if upload did not attach.`);
      navigate(`/shows/${created.id}`);
    } catch { setActionError('Could not create this show. Check required fields, session, and backend logs.'); }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedDate(event.date);
    if (event.kind === CalendarEventKind.SHOW) navigate(`/shows/${event.id}`);
    else setDeleteTarget(event);
  };

  const confirmDeleteCalendarEvent = async () => {
    if (!deleteTarget) return;
    setActionError(undefined); setActionSuccess(undefined);
    try {
      if (deleteTarget.kind === CalendarEventKind.HOLD) { await deleteHold(deleteTarget.id).unwrap(); setActionSuccess('Hold removed.'); }
      else if (deleteTarget.kind === CalendarEventKind.BLOCKED) { await deleteBlocked(deleteTarget.id).unwrap(); setActionSuccess('Blocked date removed.'); }
      setDeleteTarget(null);
    } catch { setActionError('Could not remove this calendar item. Check your session and backend logs.'); }
  };

  const initialCalendarShow = create(ShowSchema, { id: 0, artist: '', date: selectedDate, doorsTime: '8:00 PM', startTime: '9:00 PM', age: '21+', price: '', genre: '', status: ShowStatus.CONFIRMED, capacity: 150, lineup: [] });

  return (
    <AppShell page="calendar" title="Calendar" eyebrow="Home / Calendar" subtitle="Plan the room · holds, confirms, and off-nights" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="plus" onClick={() => openDialog('hold')} disabled={holdState.isLoading}>Add hold</Button><Button variant="outline" size="sm" iconLeft="plus" onClick={() => openDialog('show')}>New show</Button><Button size="sm" iconLeft="warning" onClick={() => openDialog('blocked')} disabled={blockedState.isLoading}>Block date</Button></div>}>
      <NewShowModal isOpen={dialog === 'show'} mode="create" initialShow={initialCalendarShow} isSaving={createShowState.isLoading} error={actionError} onCancel={() => setDialog(null)} onSubmit={handleCreateShow} />
      <ConfirmDialog isOpen={Boolean(deleteTarget)} title={`Remove ${deleteTarget?.kind === CalendarEventKind.HOLD ? 'hold' : 'blocked date'}?`} description={deleteTarget ? `${deleteTarget.label} on ${deleteTarget.date}` : ''} confirmLabel="Remove" variant="danger" isLoading={deleteHoldState.isLoading || deleteBlockedState.isLoading} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDeleteCalendarEvent} />
      {dialog && dialog !== 'show' && <CalendarItemDialog mode={dialog} draft={draft} isSaving={holdState.isLoading || blockedState.isLoading} onChange={setDraft} onCancel={() => setDialog(null)} onSubmit={submitCalendarDialog} />}
      {isLoading ? <LoadingState /> : isError || !events ? <ErrorState /> : <><ActionMessages error={actionError} success={actionSuccess} /><CalendarBoard events={events} monthLabel={monthLabel(visibleMonth.year, visibleMonth.monthIndex)} year={visibleMonth.year} monthIndex={visibleMonth.monthIndex} selectedDate={selectedDate} onPreviousMonth={() => jumpMonth(-1)} onToday={jumpToday} onNextMonth={() => jumpMonth(1)} onSelectDate={setSelectedDate} onEventClick={handleEventClick} onOpenShow={(showId) => navigate(`/shows/${showId}`)} onAddToday={() => openDialog('hold')} /><CalendarDayInspector selectedDate={selectedDate} events={selectedEvents} onCreateShow={(date) => openDialog('show', date)} onAddHold={(date) => openDialog('hold', date)} onBlockDay={(date) => openDialog('blocked', date)} onOpenShow={handleEventClick} onRemoveItem={setDeleteTarget} /></>}
    </AppShell>
  );
}
