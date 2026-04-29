import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ConfirmDialog, NewShowModal, ShowEditHeader, ShowEditMain, ShowEditRail } from '../../components/organisms';
import { ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function ShowDetailPage() {
  const navigate = useNavigate();
  const id = parseRouteId(useParams().id);
  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
  const [cancelShow, cancelState] = useCancelShowMutation();
  const [archiveShow, archiveState] = useArchiveShowMutation();
  const [announceShow] = useAnnounceShowMutation();
  const [createShow] = useCreateShowMutation();
  const [updateShow, updateState] = useUpdateShowMutation();
  const [uploadFlyer, uploadState] = useUploadShowFlyerMutation();
  const [deleteFlyer, deleteFlyerState] = useDeleteShowFlyerMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'archive' | 'cancel' | 'delete-flyer' | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
  const [localFlyerUrl, setLocalFlyerUrl] = useState<string | undefined>();

  useEffect(() => {
    setLocalFlyerUrl(undefined);
  }, [show?.id, show?.flyerUrl]);

  const visibleFlyerUrl = localFlyerUrl ?? show?.flyerUrl;

  const handleUpdateShow = async (nextShow: Parameters<typeof updateShow>[0], flyerFile?: File) => {
    if (!show) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      let showToSave = nextShow;
      if (flyerFile) {
        const uploaded = await uploadFlyer({ showId: show.id, file: flyerFile }).unwrap();
        setLocalFlyerUrl(uploaded.url);
        showToSave = { ...nextShow, flyerUrl: uploaded.url };
      }
      await updateShow(showToSave).unwrap();
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
      const uploaded = await uploadFlyer({ showId: show.id, file }).unwrap();
      setLocalFlyerUrl(uploaded.url);
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
    if (!visibleFlyerUrl || !show) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      const filename = visibleFlyerUrl.split('/').pop() ?? visibleFlyerUrl;
      await deleteFlyer({ showId: show.id, filename }).unwrap();
      setConfirmAction(null);
      setLocalFlyerUrl('');
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

  const handlePreview = () => {
    if (!show) return;
    window.open(`/shows/${show.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppShell page="show-detail" title={show?.artist ?? 'Show detail'} eyebrow="Shows / Detail">
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

          <ShowEditHeader
            title="Edit show"
            isSaving={updateState.isLoading || uploadState.isLoading}
            canPreview={Boolean(show.flyerUrl)}
            onBack={() => navigate('/shows')}
            onPreview={handlePreview}
            onDuplicate={handleDuplicateShow}
            onSave={() => setEditorOpen(true)}
          />

          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
          {actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}

          <div className="app-show-edit-workspace" data-section="show-edit-workspace">
            <ShowEditRail
              show={show}
              flyerUrl={visibleFlyerUrl}
              isUploading={uploadState.isLoading}
              isDeleting={deleteFlyerState.isLoading}
              onUploadFlyer={handleUploadFlyer}
              onDeleteFlyer={() => setConfirmAction('delete-flyer')}
              onAnnounce={handleAnnounceShow}
              onOpenPost={openDiscordPost}
            />
            <ShowEditMain show={show} />
          </div>

          <div className="app-detail-actions">
            <button type="button" className="app-detail-danger-link" onClick={() => setConfirmAction('cancel')} disabled={cancelState.isLoading}>Cancel show</button>
            <button type="button" className="app-detail-muted-link" onClick={() => setConfirmAction('archive')} disabled={archiveState.isLoading}>Archive show</button>
          </div>
        </>
      )}
    </AppShell>
  );
}
