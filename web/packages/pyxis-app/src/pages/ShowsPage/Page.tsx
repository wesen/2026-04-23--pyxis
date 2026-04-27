import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShowStatus } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { useCreateShowMutation, useGetShowsQuery, useUploadShowFlyerMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { NewShowModal } from '../../components/organisms';
import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function ShowsPage() {
  const navigate = useNavigate();
  const { data: shows, isLoading, isError } = useGetShowsQuery();
  const [createShow, createState] = useCreateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();
  const confirmed = (shows ?? [])
    .filter((show) => show.status === ShowStatus.CONFIRMED)
    .sort((a, b) => a.date.localeCompare(b.date));
  const archived = (shows ?? []).filter((show) => show.status === ShowStatus.ARCHIVED);

  const handleCreateShow = async (show: Parameters<typeof createShow>[0], flyerFile?: File) => {
    setActionError(undefined);
    try {
      const created = await createShow(show).unwrap();
      if (flyerFile) {
        await uploadFlyer({ showId: created.id, file: flyerFile }).unwrap();
      }
      setEditorOpen(false);
      navigate(`/shows/${created.id}`);
    } catch {
      setActionError('Could not create this show. Check required fields, session, and backend logs.');
    }
  };

  return (
    <AppShell
      page="shows"
      title="Shows"
      eyebrow="Home / Shows"
      action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="filter" aria-label="Filter shows" /><Button variant="outline" size="sm" iconLeft="search" aria-label="Search shows" /><Button size="sm" iconLeft="plus" onClick={() => setEditorOpen(true)}>New show</Button></div>}
    >
      {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
      <NewShowModal isOpen={isEditorOpen} mode="create" isSaving={createState.isLoading || uploadState.isLoading} error={actionError} onCancel={() => setEditorOpen(false)} onSubmit={handleCreateShow} />
      {isLoading ? (
        <LoadingState />
      ) : isError || !shows ? (
        <ErrorState />
      ) : shows.length === 0 ? (
        <EmptyState label="No shows returned from the real backend." />
      ) : (
        <>
          <ShowsFilterBar confirmedCount={confirmed.length} />
          <ShowsConfirmedPanel shows={confirmed} />
          <div style={{ height: 20 }} />
          <ShowsArchivedPanel shows={archived} />
        </>
      )}
    </AppShell>
  );
}
