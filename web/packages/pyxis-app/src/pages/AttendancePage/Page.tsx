import { useState } from 'react';
import { useGetAttendanceQuery, useUpdateAttendanceMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { AttendancePanel, Panel } from '../../components/organisms/Panels';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function AttendancePage() {
  const { data: entries, isLoading, isError } = useGetAttendanceQuery();
  const [updateAttendance, updateState] = useUpdateAttendanceMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleUpdateEntry = async (entry: NonNullable<typeof entries>[number]) => {
    setActionError(undefined); setActionSuccess(undefined);
    try {
      await updateAttendance({ showId: entry.showId, draw: entry.draw > 0 ? entry.draw : 1, notes: entry.notes || 'Logged from staff app.', incident: entry.incident, incidentNotes: entry.incidentNotes }).unwrap();
      setActionSuccess(`Attendance updated for ${entry.artist}.`);
    } catch { setActionError('Could not update attendance. Check your session and backend logs.'); }
  };

  return (
    <AppShell page="attendance" title="Post-show log" eyebrow="Home / Post-show log">
      {isLoading ? <LoadingState /> : isError || !entries ? <ErrorState /> : entries.length === 0 ? <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No attendance logs returned from the backend." /></> : <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Past shows" section="attendance-past-shows"><AttendancePanel entries={entries} onUpdateEntry={handleUpdateEntry} isUpdating={updateState.isLoading} /></Panel></>}
    </AppShell>
  );
}
