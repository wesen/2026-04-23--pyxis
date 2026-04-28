import { useState } from 'react';
import { Button } from 'pyxis-components';
import type { Submission } from 'pyxis-types';
import { useApproveBookingMutation, useDeclineBookingMutation, useGetBookingsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { BookingsInboxPanel, BookingsInsightsPanel, BookingsProcessedPanel, ConfirmDialog } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

type PendingBookingAction = { type: 'approve' | 'decline'; booking: Submission } | null;

export function BookingsPage() {
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [pendingAction, setPendingAction] = useState<PendingBookingAction>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const publicBookUrl = `${window.location.origin.replace('3008', '3007')}/book`;

  const handleHold = (booking: Submission) => {
    setActionSuccess(undefined);
    setActionError(`Hold is not fully implemented yet for ${booking.artistName}; it needs a backend status transition and notification policy.`);
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    setActionError(undefined); setActionSuccess(undefined);
    try {
      if (pendingAction.type === 'approve') {
        const show = await approveBooking(pendingAction.booking.id).unwrap();
        setActionSuccess(`${pendingAction.booking.artistName} approved and show #${show.id} created.`);
      } else {
        await declineBooking(pendingAction.booking.id).unwrap();
        setActionSuccess(`${pendingAction.booking.artistName} declined.`);
      }
      setPendingAction(null);
    } catch {
      setActionError(`Could not ${pendingAction.type} this booking. Check your session and backend logs.`);
    }
  };

  return (
    <AppShell page="bookings" title="Bookings" eyebrow="Home / Bookings" subtitle="Submissions from #booking-requests" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="external" onClick={() => window.open(publicBookUrl, '_blank', 'noopener,noreferrer')}>Open form</Button><Button size="sm" iconLeft="sparkle" disabled title="Auto-review needs backend support">Auto-review</Button></div>}>
      <ConfirmDialog
        isOpen={pendingAction?.type === 'approve'}
        title="Approve booking?"
        description="This will approve the submission and create a staff show record from the booking request."
        confirmLabel="Approve booking"
        variant="success"
        isLoading={approveState.isLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
      <ConfirmDialog
        isOpen={pendingAction?.type === 'decline'}
        title="Decline booking?"
        description="This marks the submission as declined. A future pass should add a required decline reason before sending artist-facing notifications."
        confirmLabel="Decline booking"
        variant="danger"
        isLoading={declineState.isLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
      {isLoading ? <LoadingState /> : isError || !bookings ? <ErrorState /> : bookings.length === 0 ? <EmptyState label="No booking submissions returned from the backend." /> : <div className="app-bookings-layout"><div>{actionError && <div className="app-action-error" role="alert">{actionError}</div>}{actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}<BookingsInboxPanel bookings={bookings} onHold={handleHold} onApprove={(booking) => setPendingAction({ type: 'approve', booking })} onDecline={(booking) => setPendingAction({ type: 'decline', booking })} /><div style={{ height: 18 }} /><BookingsProcessedPanel bookings={bookings} /></div><BookingsInsightsPanel /></div>}
    </AppShell>
  );
}
