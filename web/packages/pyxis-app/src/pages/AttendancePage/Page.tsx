import { useState } from 'react';
import { useGetShowLogQuery, useUpdateShowLogMutation, type ShowLogUpdateInput } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { PostShowLogPanel } from '../../components/organisms';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function AttendancePage() {
  const { data: entries, isLoading, isError } = useGetShowLogQuery();
  const [updateShowLog] = useUpdateShowLogMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
  const [savingShowId, setSavingShowId] = useState<number | undefined>();

  const handleSaveEntry = async (update: ShowLogUpdateInput) => {
    setActionError(undefined);
    setActionSuccess(undefined);
    if ((update.draw ?? 0) < 0) { setActionError('Draw cannot be negative.'); return; }
    if ((update.draw ?? 0) > 10000) { setActionError('Draw looks too high. Double-check the number before saving.'); return; }
    if (update.incident && !update.incidentNotes?.trim()) { setActionError('Incident notes are required when Incident is checked.'); return; }
    setSavingShowId(update.showId);
    try {
      const saved = await updateShowLog(update).unwrap();
      setActionSuccess(`Post-show report saved for ${saved.artist}.`);
    } catch {
      setActionError('Could not update post-show log. Check your session and backend logs.');
    } finally {
      setSavingShowId(undefined);
    }
  };

  return (
    <AppShell page="attendance" title="Post-show log" eyebrow="Home / Post-show log">
      <ActionMessages error={actionError} success={actionSuccess} />
      {isLoading ? <LoadingState /> : isError || !entries ? <ErrorState /> : entries.length === 0 ? <EmptyState label="No past shows need post-show logs yet." /> : <PostShowLogPanel entries={entries} savingShowId={savingShowId} onSaveEntry={handleSaveEntry} />}
    </AppShell>
  );
}
