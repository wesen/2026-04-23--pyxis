import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShowStatus, type Show } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { useCreateShowMutation, useGetAuditLogQuery, useGetBookingsQuery, useGetShowsQuery, useUpdateShowMutation, useUploadShowFlyerMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { DashboardOverview, NewShowModal } from '../../components/organisms';
import { ErrorState, LoadingState } from '../shared';
import './Page.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const showsQuery = useGetShowsQuery();
  const bookingsQuery = useGetBookingsQuery();
  const logQuery = useGetAuditLogQuery();
  const [createShow, createState] = useCreateShowMutation();
  const [updateShow, updateState] = useUpdateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();

  const handleCreateShow = async (show: Show, flyerFile?: File) => {
    setActionError(undefined);
    try {
      const shouldConfirmAfterUpload = show.status === ShowStatus.CONFIRMED && flyerFile;
      const created = await createShow(shouldConfirmAfterUpload ? { ...show, status: ShowStatus.DRAFT } : show).unwrap();
      if (flyerFile) {
        const uploaded = await uploadFlyer({ showId: created.id, file: flyerFile }).unwrap();
        if (shouldConfirmAfterUpload) await updateShow({ ...show, id: created.id, flyerUrl: uploaded.url, status: ShowStatus.CONFIRMED }).unwrap();
      }
      setEditorOpen(false);
      navigate(`/shows/${created.id}`);
    } catch {
      setActionError('Could not create this show. Check required fields, session, and backend logs.');
    }
  };

  const isLoading = showsQuery.isLoading || bookingsQuery.isLoading || logQuery.isLoading;
  const isError = showsQuery.isError || bookingsQuery.isError || logQuery.isError;

  return (
    <AppShell page="dashboard" title="Welcome back, Ada" eyebrow="Home / Dashboard" subtitle="Wednesday, April 23 · live operations data" action={<Button size="sm" iconLeft="plus" onClick={() => setEditorOpen(true)}>New show</Button>}>
      <NewShowModal isOpen={isEditorOpen} mode="create" isSaving={createState.isLoading || uploadState.isLoading || updateState.isLoading} error={actionError} onCancel={() => setEditorOpen(false)} onSubmit={handleCreateShow} />
      {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
      {isLoading ? (
        <LoadingState />
      ) : isError || !showsQuery.data || !bookingsQuery.data || !logQuery.data ? (
        <ErrorState />
      ) : (
        <div data-section="dashboard-summary">
          <DashboardOverview
            shows={showsQuery.data}
            bookings={bookingsQuery.data}
            log={logQuery.data}
            onAddShow={() => setEditorOpen(true)}
            onReviewBookings={() => navigate('/bookings')}
            onOpenAuditLog={() => navigate('/log')}
            onViewAllShows={() => navigate('/shows')}
            onEditShow={(show) => navigate(`/shows/${show.id}`)}
            onViewDiscord={(show) => {
              if (show.discordMessageId && show.discordChannelId) {
                window.open(`https://discord.com/channels/@me/${show.discordChannelId}/${show.discordMessageId}`, '_blank', 'noopener,noreferrer');
              } else {
                setActionError('This show does not have a Discord post yet.');
              }
            }}
          />
        </div>
      )}
    </AppShell>
  );
}
