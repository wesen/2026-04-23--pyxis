import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'pyxis-components';
import {
  useAnnounceShowMutation,
  useArchiveShowMutation,
  useCancelShowMutation,
  useGetShowQuery,
  useCreateShowMutation,
  useDeleteShowFlyerMutation,
  useUpdateShowMutation,
  useUploadShowFlyerMutation,
} from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { ConfirmDialog, FlyerField, NewShowModal } from '../../components/organisms';
import { ShowDetailDiscordPanel, ShowDetailHero, ShowDetailInfoPanel } from '../../components/organisms';
import { appShowFromShow, ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function ShowDetailPage() {
  const navigate = useNavigate();
  const id = parseRouteId(useParams().id);
  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
  const [cancelShow, cancelState] = useCancelShowMutation();
  const [archiveShow, archiveState] = useArchiveShowMutation();
  const [announceShow, announceState] = useAnnounceShowMutation();
  const [createShow, createState] = useCreateShowMutation();
  const [updateShow, updateState] = useUpdateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [deleteFlyer, deleteFlyerState] = useDeleteShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'archive' | 'cancel' | 'delete-flyer' | null>(null);
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

  const handleUploadFlyer = async (file: File) => {
    if (!show) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await uploadFlyer({ showId: show.id, file }).unwrap();
      setActionSuccess('Flyer uploaded.');
    } catch {
      setActionError('Could not upload this flyer. Check file type, session, and backend logs.');
    }
  };

  const handleDuplicateShow = async () => {
    if (!show) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      const duplicate = await createShow({
        ...show,
        id: 0,
        artist: `${show.artist} copy`,
        status: show.status,
        discordMessageId: '',
        discordChannelId: '',
        flyerUrl: '',
      }).unwrap();
      setActionSuccess('Show duplicated.');
      navigate(`/shows/${duplicate.id}`);
    } catch {
      setActionError('Could not duplicate this show. Check required fields, session, and backend logs.');
    }
  };

  const handleDeleteFlyer = async () => {
    if (!show?.flyerUrl) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      const filename = show.flyerUrl.split('/').pop() ?? show.flyerUrl;
      await deleteFlyer({ showId: show.id, filename }).unwrap();
      setConfirmAction(null);
      setActionSuccess('Flyer deleted.');
    } catch {
      setActionError('Could not delete this flyer. Check your session and backend logs.');
    }
  };

  const handleCancelShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await cancelShow(id).unwrap();
      setConfirmAction(null);
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
      setConfirmAction(null);
      setActionSuccess('Show archived.');
    } catch {
      setActionError('Could not archive this show. Check your session and backend logs.');
    }
  };

  const openDiscordPost = () => {
    if (!show?.discordChannelId || !show?.discordMessageId) {
      setActionError('This show has not been posted to Discord yet. Use Announce first.');
      return;
    }
    window.open(`https://discord.com/channels/@me/${show.discordChannelId}/${show.discordMessageId}`, '_blank', 'noopener,noreferrer');
  };

  const handleAnnounceShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await announceShow(id).unwrap();
      setActionSuccess(show?.discordMessageId ? 'Announcement requested. Discord post is already linked below.' : 'Announcement requested. The bot will attach Discord post details when posting is available.');
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
          <ConfirmDialog isOpen={confirmAction === 'archive'} title="Archive show?" description="This moves the show into the archive and removes it from active operations views." confirmLabel="Archive show" isLoading={archiveState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleArchiveShow} />
          <ConfirmDialog isOpen={confirmAction === 'cancel'} title="Cancel show?" description="This marks the show as cancelled and records the action for staff review." confirmLabel="Cancel show" variant="danger" isLoading={cancelState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleCancelShow} />
          <ConfirmDialog isOpen={confirmAction === 'delete-flyer'} title="Delete flyer?" description="This removes the uploaded flyer from this show. You can upload a replacement afterwards." confirmLabel="Delete flyer" variant="danger" isLoading={deleteFlyerState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleDeleteFlyer} />
          <ShowDetailHero show={appShowFromShow(show)} />
          <div className="app-detail-grid"><ShowDetailInfoPanel show={appShowFromShow(show)} /><ShowDetailDiscordPanel channelLabel={show.discordChannelId ? `#${show.discordChannelId}` : '#upcoming-shows'} statusLabel={show.discordMessageId ? 'Posted' : 'Not posted yet'} isPosted={Boolean(show.discordChannelId && show.discordMessageId)} onOpenPost={openDiscordPost} /></div>
          <FlyerField flyerUrl={show.flyerUrl} isUploading={uploadState.isLoading} isDeleting={deleteFlyerState.isLoading} onUpload={handleUploadFlyer} onDelete={() => setConfirmAction('delete-flyer')} />
          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
          {actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}
          <div className="app-detail-actions">
            <Button variant="outline" onClick={handleDuplicateShow} disabled={createState.isLoading}>Duplicate</Button>
            <Button variant="outline" iconLeft="archive" onClick={() => setConfirmAction('archive')} disabled={archiveState.isLoading}>Archive</Button>
            <Button variant="outline" iconLeft="external" onClick={handleAnnounceShow} disabled={announceState.isLoading}>Announce</Button>
            <Button variant="danger" iconLeft="trash" onClick={() => setConfirmAction('cancel')} disabled={cancelState.isLoading}>Cancel show</Button>
          </div>
        </>
      )}
    </AppShell>
  );
}
