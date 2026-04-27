import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { SubmissionStatus } from 'pyxis-types';
import { useApproveBookingMutation, useDeclineBookingMutation, useGetBookingsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { BookingReviewDatePanel, BookingReviewHero, BookingReviewNotePanel, BookingReviewRequestPanel } from '../../components/organisms/Phase8Sections';
import { EmptyState, ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function BookingReviewPage() {
  const id = parseRouteId(useParams().id);
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const booking = bookings?.find((candidate) => candidate.id === id);
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [actionError, setActionError] = useState<string | undefined>();

  const handleApprove = async () => { if (!booking) return; setActionError(undefined); try { await approveBooking(booking.id).unwrap(); } catch { setActionError('Could not approve this booking. Check your session and backend logs.'); } };
  const handleDecline = async () => { if (!booking) return; setActionError(undefined); try { await declineBooking(booking.id).unwrap(); } catch { setActionError('Could not decline this booking. Check your session and backend logs.'); } };

  return (
    <AppShell page="booking-review" title={booking?.artistName ?? 'Booking review'} eyebrow="Bookings / Review" action={<Button variant="outline" size="sm" iconLeft="external" disabled={!booking}>Open link</Button>}>
      {id === undefined ? <ErrorState label="Invalid booking id in the route." /> : isLoading ? <LoadingState label="Loading booking submission from the backend…" /> : isError || !bookings ? <ErrorState /> : !booking ? <EmptyState label="No booking submission with that id was returned." /> : <><BookingReviewHero booking={booking} /><div className="app-detail-grid"><BookingReviewRequestPanel booking={booking} /><BookingReviewDatePanel /></div><BookingReviewNotePanel booking={booking} />{actionError && <div className="app-action-error" role="alert">{actionError}</div>}<div className="app-detail-actions"><Button variant="danger" iconLeft="x" onClick={handleDecline} disabled={booking.status !== SubmissionStatus.PENDING || declineState.isLoading}>Decline</Button><Button variant="success" iconLeft="check" onClick={handleApprove} disabled={booking.status !== SubmissionStatus.PENDING || approveState.isLoading}>Approve</Button></div></>}
    </AppShell>
  );
}
