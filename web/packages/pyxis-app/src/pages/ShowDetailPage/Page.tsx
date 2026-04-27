import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'pyxis-components';
import {
  useAnnounceShowMutation,
  useArchiveShowMutation,
  useCancelShowMutation,
  useGetShowQuery,
  useUpdateShowMutation,
  useUploadShowFlyerMutation,
} from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { NewShowModal } from '../../components/organisms/Panels';
import { ShowDetailDiscordPanel, ShowDetailHero, ShowDetailInfoPanel } from '../../components/organisms/Phase8Sections';
import { appShowFromShow, ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function ShowDetailPage() {
  const id = parseRouteId(useParams().id);
  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
  const [cancelShow, cancelState] = useCancelShowMutation();
  const [archiveShow, archiveState] = useArchiveShowMutation();
  const [announceShow, announceState] = useAnnounceShowMutation();
  const [updateShow, updateState] = useUpdateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleUpdateShow = async (nextShow: Parameters<typeof updateShow>[0], flyerFile?: File) => {
    if (!show) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      const updated = await updateShow(nextShow).unwrap();
      if (flyerFile) {
        await uploadFlyer({ showId: updated.id, file: flyerFile }).unwrap();
      }
      setEditorOpen(false);
      setActionSuccess('Show updated.');
    } catch {
      setActionError('Could not update this show. Check required fields, session, and backend logs.');
    }
  };

  const handleCancelShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await cancelShow(id).unwrap();
      setActionSuccess('Show cancelled.');
    } catch {
      setActionError('Could not cancel this show. Check your session and backend logs.');
    }
  };

  const handleArchiveShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await archiveShow(id).unwrap();
      setActionSuccess('Show archived.');
    } catch {
      setActionError('Could not archive this show. Check your session and backend logs.');
    }
  };

  const handleAnnounceShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await announceShow(id).unwrap();
      setActionSuccess('Announcement requested.');
    } catch {
      setActionError('Could not announce this show. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="show-detail" title={show?.artist ?? 'Show detail'} eyebrow="Shows / Detail" action={<Button size="sm" iconLeft="edit" disabled={!show} onClick={() => setEditorOpen(true)}>Edit</Button>}>
      {id === undefined ? (
        <ErrorState label="Invalid show id in the route." />
      ) : isLoading ? (
        <LoadingState label="Loading show detail from the backend…" />
      ) : isError || !show ? (
        <ErrorState label="Show not found or unavailable." />
      ) : (
        <>
          <NewShowModal isOpen={isEditorOpen} mode="edit" initialShow={show} isSaving={updateState.isLoading || uploadState.isLoading} error={actionError} onCancel={() => setEditorOpen(false)} onSubmit={handleUpdateShow} />
          <ShowDetailHero show={appShowFromShow(show)} />
          <div className="app-detail-grid"><ShowDetailInfoPanel show={appShowFromShow(show)} /><ShowDetailDiscordPanel /></div>
          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
          {actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}
          <div className="app-detail-actions">
            <Button variant="outline">Duplicate</Button>
            <Button variant="outline" iconLeft="archive" onClick={handleArchiveShow} disabled={archiveState.isLoading}>Archive</Button>
            <Button variant="outline" iconLeft="external" onClick={handleAnnounceShow} disabled={announceState.isLoading}>Announce</Button>
            <Button variant="danger" iconLeft="trash" onClick={handleCancelShow} disabled={cancelState.isLoading}>Cancel show</Button>
          </div>
        </>
      )}
    </AppShell>
  );
}
