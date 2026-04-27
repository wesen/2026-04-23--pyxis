import { useState } from 'react';
import { Button } from 'pyxis-components';
import { useApproveBookingMutation, useDeclineBookingMutation, useGetBookingsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { BookingsInboxPanel, BookingsInsightsPanel, BookingsProcessedPanel } from '../../components/organisms/Phase8Sections';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function BookingsPage() {
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const [approveBooking] = useApproveBookingMutation();
  const [declineBooking] = useDeclineBookingMutation();
  const [actionError, setActionError] = useState<string | undefined>();

  const handleApprove = async (booking: NonNullable<typeof bookings>[number]) => {
    setActionError(undefined);
    try { await approveBooking(booking.id).unwrap(); } catch { setActionError('Could not approve this booking. Check your session and backend logs.'); }
  };
  const handleDecline = async (booking: NonNullable<typeof bookings>[number]) => {
    setActionError(undefined);
    try { await declineBooking(booking.id).unwrap(); } catch { setActionError('Could not decline this booking. Check your session and backend logs.'); }
  };

  return (
    <AppShell page="bookings" title="Bookings" eyebrow="Home / Bookings" subtitle="Submissions from #booking-requests" action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="external">Open form</Button><Button size="sm" iconLeft="sparkle">Auto-review</Button></div>}>
      {isLoading ? <LoadingState /> : isError || !bookings ? <ErrorState /> : bookings.length === 0 ? <EmptyState label="No booking submissions returned from the backend." /> : <div className="app-bookings-layout"><div>{actionError && <div className="app-action-error" role="alert">{actionError}</div>}<BookingsInboxPanel bookings={bookings} onApprove={handleApprove} onDecline={handleDecline} /><div style={{ height: 18 }} /><BookingsProcessedPanel bookings={bookings} /></div><BookingsInsightsPanel /></div>}
    </AppShell>
  );
}
