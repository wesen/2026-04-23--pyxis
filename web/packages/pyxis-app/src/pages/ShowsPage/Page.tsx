import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShowStatus } from 'pyxis-types';
import { Button, Input } from 'pyxis-components';
import { useCreateShowMutation, useGetShowsQuery, useUploadShowFlyerMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { NewShowModal } from '../../components/organisms';
import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar, type ShowsFilterValue } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function ShowsPage() {
  const navigate = useNavigate();
  const { data: shows, isLoading, isError } = useGetShowsQuery();
  const [createShow, createState] = useCreateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ShowsFilterValue>(ShowStatus.CONFIRMED);
  const [actionError, setActionError] = useState<string | undefined>();
  const allShows = shows ?? [];
  const counts: Record<ShowsFilterValue, number> = {
    all: allShows.length,
    [ShowStatus.CONFIRMED]: allShows.filter((show) => show.status === ShowStatus.CONFIRMED).length,
    [ShowStatus.HOLD]: allShows.filter((show) => show.status === ShowStatus.HOLD).length,
    [ShowStatus.CANCELLED]: allShows.filter((show) => show.status === ShowStatus.CANCELLED).length,
    [ShowStatus.DRAFT]: allShows.filter((show) => show.status === ShowStatus.DRAFT).length,
    [ShowStatus.ARCHIVED]: allShows.filter((show) => show.status === ShowStatus.ARCHIVED).length,
  };
  const searchNeedle = search.trim().toLowerCase();
  const filtered = allShows
    .filter((show) => activeFilter === 'all' || show.status === activeFilter)
    .filter((show) => !searchNeedle || `${show.artist} ${show.genre} ${show.date}`.toLowerCase().includes(searchNeedle))
    .sort((a, b) => a.date.localeCompare(b.date));
  const confirmed = filtered.filter((show) => show.status === ShowStatus.CONFIRMED);
  const hold = filtered.filter((show) => show.status === ShowStatus.HOLD);
  const cancelled = filtered.filter((show) => show.status === ShowStatus.CANCELLED);
  const drafts = filtered.filter((show) => show.status === ShowStatus.DRAFT);
  const archived = filtered.filter((show) => show.status === ShowStatus.ARCHIVED);

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
      action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="filter" aria-label="Filter shows" onClick={() => setActiveFilter((current) => current === 'all' ? ShowStatus.CONFIRMED : 'all')}/><Button variant="outline" size="sm" iconLeft="search" aria-label="Search shows" onClick={() => setSearchOpen((open) => !open)} /><Button size="sm" iconLeft="plus" onClick={() => setEditorOpen(true)}>New show</Button></div>}
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
          {searchOpen && <div className="app-page-search" role="search"><Input placeholder="Search artist, genre, or date…" value={search} onChange={(event) => setSearch(event.target.value)} autoFocus /></div>}
          <ShowsFilterBar counts={counts} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          {activeFilter === 'all' || activeFilter === ShowStatus.CONFIRMED ? <ShowsConfirmedPanel shows={confirmed} onEditShow={(show) => navigate(`/shows/${show.id}`)} /> : null}
          {activeFilter === ShowStatus.HOLD ? <ShowsConfirmedPanel shows={hold} title={`Hold · ${hold.length}`} emptyTitle="No shows on hold." note="Held shows are not public until confirmed." onEditShow={(show) => navigate(`/shows/${show.id}`)} /> : null}
          {activeFilter === ShowStatus.CANCELLED ? <ShowsConfirmedPanel shows={cancelled} title={`Cancelled · ${cancelled.length}`} emptyTitle="No cancelled shows." note="Cancelled shows stay visible for operational history." onEditShow={(show) => navigate(`/shows/${show.id}`)} /> : null}
          {activeFilter === ShowStatus.DRAFT ? <ShowsConfirmedPanel shows={drafts} title={`Drafts · ${drafts.length}`} emptyTitle="No draft shows." note="Drafts are staff-only until confirmed." onEditShow={(show) => navigate(`/shows/${show.id}`)} /> : null}
          {filtered.length === 0 && <EmptyState label="No shows match the current filters." />}
          <div style={{ height: 20 }} />
          {activeFilter === 'all' || activeFilter === ShowStatus.ARCHIVED ? <ShowsArchivedPanel shows={archived} onViewArchive={() => setActiveFilter(ShowStatus.ARCHIVED)} /> : null}
        </>
      )}
    </AppShell>
  );
}
