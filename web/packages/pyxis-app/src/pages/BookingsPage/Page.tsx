import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'pyxis-components';
import type { Submission } from 'pyxis-types';
import { create, ShowSchema, ShowStatus, SubmissionStatus } from 'pyxis-types';
import { useApproveBookingMutation, useCreateShowMutation, useDeclineBookingMutation, useGetBookingsQuery, useUpdateBookingMutation, useUpdateBookingReviewMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { BookingsInboxPanel, BookingsInsightsPanel, BookingsProcessedPanel, ConfirmDialog } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

type PendingBookingAction = { type: 'approve' | 'decline'; booking: Submission } | null;

const declineTemplates = ['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info'];

export function BookingsPage() {
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [createShow] = useCreateShowMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [updateReview, updateReviewState] = useUpdateBookingReviewMutation();
  const [pendingAction, setPendingAction] = useState<PendingBookingAction>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const publicBookUrl = `${window.location.origin.replace('3008', '3007')}/book`;

  const handleHold = async (booking: Submission) => {
    setActionSuccess(undefined); setActionError(undefined);
    try {
      await updateBooking({ id: booking.id, artistName: booking.artistName, preferredDate: booking.preferredDate, genre: booking.genre, expectedDraw: booking.expectedDraw, links: booking.links, techRider: booking.techRider, message: booking.message, contactDiscord: booking.contactDiscord, status: SubmissionStatus.HOLD }).unwrap();
      await updateReview({ submissionId: booking.id, note: 'Placed on hold for follow-up.', decision: 'hold' }).unwrap();
      const holdShow = await createShow(create(ShowSchema, {
        id: 0,
        artist: booking.artistName,
        artistId: booking.artistId,
        date: booking.preferredDate,
        doorsTime: '',
        startTime: '',
        age: '',
        price: '',
        genre: booking.genre,
        description: booking.message,
        notes: `Held from booking #${booking.id}. ${booking.techRider ? `Tech rider: ${booking.techRider}` : ''}`.trim(),
        status: ShowStatus.HOLD,
        flyerUrl: '',
        discordMessageId: '',
        discordChannelId: '',
        submissionId: booking.id,
        draw: booking.expectedDraw,
        capacity: 0,
        lineup: [],
        createdAt: '',
        updatedAt: '',
      })).unwrap();
      setActionSuccess(`${booking.artistName} moved to hold and show #${holdShow.id} created.`);
    } catch {
      setActionError(`Could not move ${booking.artistName} to hold. Check your session and backend logs.`);
    }
  };

  const startDecline = (booking: Submission) => {
    setDeclineReason('');
    setPendingAction({ type: 'decline', booking });
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    setActionError(undefined); setActionSuccess(undefined);
    try {
      if (pendingAction.type === 'approve') {
        const show = await approveBooking(pendingAction.booking.id).unwrap();
        setPendingAction(null);
        setActionSuccess(`${pendingAction.booking.artistName} approved and show #${show.id} created.`);
        navigate(`/shows/${show.id}`);
      } else {
        if (!declineReason.trim()) { setActionError('Add a decline reason before declining this booking.'); return; }
        await updateReview({ submissionId: pendingAction.booking.id, note: declineReason.trim(), decision: 'decline' }).unwrap();
        await declineBooking(pendingAction.booking.id).unwrap();
        setPendingAction(null);
        setDeclineReason('');
        setActionSuccess(`${pendingAction.booking.artistName} declined.`);
      }
    } catch {
      setActionError(`Could not ${pendingAction.type} this booking. Check your session and backend logs.`);
    }
  };

  const handleTemplate = (template: string) => {
    if (pendingAction?.type === 'decline') {
      setDeclineReason(template);
      setActionError(undefined);
      return;
    }
    setActionSuccess(undefined);
    setActionError(`Open Decline on a booking first; then choose “${template}” to fill the decline reason.`);
  };

  return (
    <AppShell page="bookings" title="Bookings" eyebrow="Home / Bookings" subtitle="Submissions from #booking-requests" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="external" onClick={() => window.open(publicBookUrl, '_blank', 'noopener,noreferrer')}>Open form</Button></div>}>
      <ConfirmDialog
        isOpen={pendingAction?.type === 'approve'}
        title={`Approve ${pendingAction?.booking.artistName ?? 'booking'}?`}
        description={`This will approve the submission and create a draft show for ${pendingAction?.booking.preferredDate || 'the requested date'}. You will be taken to the new show.`}
        confirmLabel="Approve and open show"
        variant="success"
        isLoading={approveState.isLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
      {pendingAction?.type === 'decline' && (
        <section className="app-form-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="decline-booking-title">
          <div className="app-form-dialog">
            <header><span className="app-confirm-dialog__eyebrow">Decline booking</span><h2 id="decline-booking-title">Decline {pendingAction.booking.artistName}?</h2><p>Record a reason before changing the submission status. This reason is saved as the booking review note.</p></header>
            <div className="app-template-list">{declineTemplates.map((template) => <button key={template} type="button" onClick={() => setDeclineReason(template)}>{template}</button>)}</div>
            <label className="app-form-grid"><span>Decline reason</span><textarea rows={4} value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} /></label>
            {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
            <footer className="app-detail-actions"><Button variant="ghost" onClick={() => setPendingAction(null)}>Cancel</Button><Button variant="danger" onClick={confirmPendingAction} isLoading={declineState.isLoading || updateReviewState.isLoading} disabled={!declineReason.trim()}>Decline booking</Button></footer>
          </div>
        </section>
      )}
      {isLoading ? <LoadingState /> : isError || !bookings ? <ErrorState /> : bookings.length === 0 ? <EmptyState label="No booking submissions returned from the backend." /> : <div className="app-bookings-layout"><div>{actionError && pendingAction?.type !== 'decline' && <div className="app-action-error" role="alert">{actionError}</div>}{actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}<BookingsInboxPanel bookings={bookings} onHold={handleHold} onApprove={(booking) => setPendingAction({ type: 'approve', booking })} onDecline={startDecline} /><div style={{ height: 18 }} /><BookingsProcessedPanel bookings={bookings} onViewArchive={() => navigate('/log?entity=submission&action=submission')} /></div><BookingsInsightsPanel templates={declineTemplates} onSelectTemplate={handleTemplate} /></div>}
    </AppShell>
  );
}
