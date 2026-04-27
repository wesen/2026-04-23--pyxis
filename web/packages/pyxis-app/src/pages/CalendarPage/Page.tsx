import { useState } from 'react';
import { Button } from 'pyxis-components';
import { useCreateCalendarBlockedMutation, useCreateCalendarHoldMutation, useGetCalendarQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { CalendarBoard } from '../../components/organisms/Phase8Sections';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function CalendarPage() {
  const { data: events, isLoading, isError } = useGetCalendarQuery();
  const [createHold, holdState] = useCreateCalendarHoldMutation();
  const [createBlocked, blockedState] = useCreateCalendarBlockedMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleCreateHold = async () => {
    setActionError(undefined); setActionSuccess(undefined);
    try { await createHold({ date: '2026-06-01', label: 'Hold — TBD' }).unwrap(); setActionSuccess('Hold created for 2026-06-01.'); }
    catch { setActionError('Could not create hold. Check your session and backend logs.'); }
  };

  const handleCreateBlocked = async () => {
    setActionError(undefined); setActionSuccess(undefined);
    try { await createBlocked({ date: '2026-06-02', reason: 'Closed' }).unwrap(); setActionSuccess('Blocked date created for 2026-06-02.'); }
    catch { setActionError('Could not create blocked date. Check your session and backend logs.'); }
  };

  return (
    <AppShell page="calendar" title="Calendar" eyebrow="Home / Calendar" subtitle="Plan the room · holds, confirms, and off-nights" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="plus" onClick={handleCreateHold} disabled={holdState.isLoading}>Add hold</Button><Button size="sm" iconLeft="warning" onClick={handleCreateBlocked} disabled={blockedState.isLoading}>Block date</Button></div>}>
      {isLoading ? <LoadingState /> : isError || !events ? <ErrorState /> : events.length === 0 ? <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No holds or blocked dates returned yet." /></> : <><ActionMessages error={actionError} success={actionSuccess} /><CalendarBoard events={events} /></>}
    </AppShell>
  );
}
