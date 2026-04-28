import { useMemo, useState } from 'react';
import { useGetAttendanceQuery, useUpdateAttendanceMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { AttendancePanel, Panel } from '../../components/organisms';
import type { AttendanceDraft } from '../../components/organisms/Roster/AttendancePanel/AttendancePanel';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function AttendancePage() {
  const { data: entries, isLoading, isError } = useGetAttendanceQuery();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
  const [savingEntryId, setSavingEntryId] = useState<number | undefined>();
  const [query, setQuery] = useState('');

  const visibleEntries = useMemo(() => {
    if (!entries) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => [entry.artist, entry.date, entry.notes, entry.incidentNotes].some((value) => value.toLowerCase().includes(needle)));
  }, [entries, query]);

  const handleUpdateEntry = async (entry: NonNullable<typeof entries>[number], draft: AttendanceDraft) => {
    setActionError(undefined); setActionSuccess(undefined);
    if (draft.draw < 0) { setActionError('Draw cannot be negative.'); return; }
    if (draft.draw > 10000) { setActionError('Draw looks too high. Double-check the number before saving.'); return; }
    if (draft.incident && !draft.incidentNotes.trim()) { setActionError('Incident notes are required when Incident is checked.'); return; }
    const entryKey = entry.id || entry.showId;
    setSavingEntryId(entryKey);
    try {
      await updateAttendance({ showId: entry.showId, draw: draft.draw, notes: draft.notes, incident: draft.incident, incidentNotes: draft.incident ? draft.incidentNotes : '' }).unwrap();
      setActionSuccess(`Attendance updated for ${entry.artist}.`);
    } catch { setActionError('Could not update attendance. Check your session and backend logs.'); }
    finally { setSavingEntryId(undefined); }
  };

  return (
    <AppShell page="attendance" title="Post-show log" eyebrow="Home / Post-show log">
      {isLoading ? <LoadingState /> : isError || !entries ? <ErrorState /> : entries.length === 0 ? <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No attendance logs returned from the backend." /></> : <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Past shows" section="attendance-past-shows"><label className="app-page-search"><span>Search attendance</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artist, date, notes, incident" /></label>{visibleEntries.length > 0 ? <AttendancePanel entries={visibleEntries} onUpdateEntry={handleUpdateEntry} savingEntryId={savingEntryId} /> : <EmptyState label="No attendance entries match that search." />}</Panel></>}
    </AppShell>
  );
}
