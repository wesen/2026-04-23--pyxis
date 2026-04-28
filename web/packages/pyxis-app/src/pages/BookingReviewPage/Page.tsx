import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { SubmissionStatus } from 'pyxis-types';
import { useApproveBookingMutation, useDeclineBookingMutation, useGetBookingReviewQuery, useGetBookingsQuery, useUpdateBookingMutation, useUpdateBookingReviewMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { BookingReviewDatePanel, BookingReviewHero, BookingReviewNotePanel, BookingReviewRequestPanel, ConfirmDialog } from '../../components/organisms';
import type { BookingDetailsDraft } from '../../components/organisms/Bookings/BookingReviewRequestPanel/BookingReviewRequestPanel';
import { EmptyState, ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function BookingReviewPage() {
  const id = parseRouteId(useParams().id);
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const booking = bookings?.find((candidate) => candidate.id === id);
  const { data: review } = useGetBookingReviewQuery(id ?? 0, { skip: id === undefined });
  const [updateReview, updateReviewState] = useUpdateBookingReviewMutation();
  const [updateBooking, updateBookingState] = useUpdateBookingMutation();
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [confirmAction, setConfirmAction] = useState<'approve' | 'decline' | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const openBookingLink = () => {
    if (!booking?.links) return;
    const href = /^https?:\/\//.test(booking.links) ? booking.links : `https://${booking.links}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleApprove = async () => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { const show = await approveBooking(booking.id).unwrap(); setConfirmAction(null); setActionSuccess(`Booking approved and show #${show.id} created.`); } catch { setActionError('Could not approve this booking. Check your session and backend logs.'); } };
  const handleDecline = async () => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { await declineBooking(booking.id).unwrap(); setConfirmAction(null); setActionSuccess('Booking declined.'); } catch { setActionError('Could not decline this booking. Check your session and backend logs.'); } };
  const handleSaveReview = async (note: string) => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { await updateReview({ submissionId: booking.id, note, decision: review?.decision || 'none' }).unwrap(); setActionSuccess('Review note saved.'); } catch { setActionError('Could not save review note. Check your session and backend logs.'); } };
  const handleSaveDetails = async (draft: BookingDetailsDraft) => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { await updateBooking({ id: booking.id, ...draft }).unwrap(); setActionSuccess('Booking details saved.'); } catch { setActionError('Could not save booking details. Check your session and backend logs.'); } }; 

  return (
    <AppShell page="booking-review" title={booking?.artistName ?? 'Booking review'} eyebrow="Bookings / Review" action={<Button variant="outline" size="sm" iconLeft="external" disabled={!booking?.links} onClick={openBookingLink}>Open link</Button>}>
      <ConfirmDialog isOpen={confirmAction === 'approve'} title="Approve booking?" description="This will approve the submission and create a show record from it." confirmLabel="Approve booking" variant="success" isLoading={approveState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleApprove} />
      <ConfirmDialog isOpen={confirmAction === 'decline'} title="Decline booking?" description="This marks the submission as declined. A future pass should collect an artist-facing reason before notification." confirmLabel="Decline booking" variant="danger" isLoading={declineState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleDecline} />
      {id === undefined ? <ErrorState label="Invalid booking id in the route." /> : isLoading ? <LoadingState label="Loading booking submission from the backend…" /> : isError || !bookings ? <ErrorState /> : !booking ? <EmptyState label="No booking submission with that id was returned." /> : <><BookingReviewHero booking={booking} /><div className="app-detail-grid"><BookingReviewRequestPanel booking={booking} isSaving={updateBookingState.isLoading} onSaveDetails={handleSaveDetails} /><BookingReviewDatePanel /></div><BookingReviewNotePanel booking={booking} review={review} isSaving={updateReviewState.isLoading} onSaveReview={handleSaveReview} />{actionError && <div className="app-action-error" role="alert">{actionError}</div>}{actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}<div className="app-detail-actions"><Button variant="danger" iconLeft="x" onClick={() => setConfirmAction('decline')} disabled={booking.status !== SubmissionStatus.PENDING || declineState.isLoading}>Decline</Button><Button variant="success" iconLeft="check" onClick={() => setConfirmAction('approve')} disabled={booking.status !== SubmissionStatus.PENDING || approveState.isLoading}>Approve</Button></div></>}
    </AppShell>
  );
}
