import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { SubmissionStatus } from 'pyxis-types';
import { useApproveBookingMutation, useDeclineBookingMutation, useGetBookingReviewQuery, useGetBookingsQuery, useGetCalendarQuery, useUpdateBookingMutation, useUpdateBookingReviewMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { BookingReviewDatePanel, BookingReviewHero, BookingReviewNotePanel, BookingReviewRequestPanel, ConfirmDialog } from '../../components/organisms';
import type { BookingDetailsDraft } from '../../components/organisms/Bookings/BookingReviewRequestPanel/BookingReviewRequestPanel';
import { EmptyState, ErrorState, LoadingState, parseRouteId } from '../shared';
import './Page.css';

export function BookingReviewPage() {
  const navigate = useNavigate();
  const id = parseRouteId(useParams().id);
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const booking = bookings?.find((candidate) => candidate.id === id);
  const { data: review } = useGetBookingReviewQuery(id ?? 0, { skip: id === undefined });
  const { data: calendarEvents } = useGetCalendarQuery();
  const [updateReview, updateReviewState] = useUpdateBookingReviewMutation();
  const [updateBooking, updateBookingState] = useUpdateBookingMutation();
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [confirmAction, setConfirmAction] = useState<'approve' | 'decline' | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const openBookingLink = () => {
    if (!booking?.links) return;
    const href = /^https?:\/\//.test(booking.links) ? booking.links : `https://${booking.links}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleApprove = async () => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { const show = await approveBooking(booking.id).unwrap(); setConfirmAction(null); setActionSuccess(`Booking approved and show #${show.id} created.`); navigate(`/shows/${show.id}`); } catch { setActionError('Could not approve this booking. Check your session and backend logs.'); } };
  const handleDecline = async () => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); if (!declineReason.trim()) { setActionError('Add a decline reason before declining this booking.'); return; } try { await updateReview({ submissionId: booking.id, note: declineReason.trim(), decision: 'decline' }).unwrap(); await declineBooking(booking.id).unwrap(); setConfirmAction(null); setDeclineReason(''); setActionSuccess('Booking declined.'); } catch { setActionError('Could not decline this booking. Check your session and backend logs.'); } };
  const handleSaveReview = async (note: string) => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { await updateReview({ submissionId: booking.id, note, decision: review?.decision || 'none' }).unwrap(); setActionSuccess('Review note saved.'); } catch { setActionError('Could not save review note. Check your session and backend logs.'); } };
  const handleSaveDetails = async (draft: BookingDetailsDraft) => { if (!booking) return; setActionError(undefined); setActionSuccess(undefined); try { await updateBooking({ id: booking.id, ...draft }).unwrap(); setActionSuccess('Booking details saved.'); } catch { setActionError('Could not save booking details. Check your session and backend logs.'); } }; 

  return (
    <AppShell page="booking-review" title={booking?.artistName ?? 'Booking review'} eyebrow="Bookings / Review" action={<Button variant="outline" size="sm" iconLeft="external" disabled={!booking?.links} onClick={openBookingLink}>Open link</Button>}>
      <ConfirmDialog isOpen={confirmAction === 'approve'} title="Approve booking?" description="This will approve the submission, create a draft show record from it, and take you to the new show." confirmLabel="Approve and open show" variant="success" isLoading={approveState.isLoading} onCancel={() => setConfirmAction(null)} onConfirm={handleApprove} />
      {confirmAction === 'decline' && (
        <section className="app-form-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="review-decline-title">
          <div className="app-form-dialog"><header><span className="app-confirm-dialog__eyebrow">Decline booking</span><h2 id="review-decline-title">Decline {booking?.artistName ?? 'booking'}?</h2><p>Record a reason before changing the submission status. This is saved as the booking review note.</p></header><div className="app-template-list">{['Not a fit right now','Double-booked that night','Too soon — try next season','Need more info'].map((template) => <button key={template} type="button" onClick={() => setDeclineReason(template)}>{template}</button>)}</div><label className="app-form-grid"><span>Decline reason</span><textarea rows={4} value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} /></label>{actionError && <div className="app-action-error" role="alert">{actionError}</div>}<footer className="app-detail-actions"><Button variant="ghost" onClick={() => setConfirmAction(null)}>Cancel</Button><Button variant="danger" onClick={handleDecline} isLoading={declineState.isLoading || updateReviewState.isLoading} disabled={!declineReason.trim()}>Decline booking</Button></footer></div>
        </section>
      )}
      {id === undefined ? <ErrorState label="Invalid booking id in the route." /> : isLoading ? <LoadingState label="Loading booking submission from the backend…" /> : isError || !bookings ? <ErrorState /> : !booking ? <EmptyState label="No booking submission with that id was returned." /> : <><BookingReviewHero booking={booking} /><div className="app-detail-grid"><BookingReviewRequestPanel booking={booking} isSaving={updateBookingState.isLoading} onSaveDetails={handleSaveDetails} /><BookingReviewDatePanel booking={booking} events={calendarEvents ?? []} isSaving={updateBookingState.isLoading} onSaveDate={(date) => handleSaveDetails({ artistName: booking.artistName, preferredDate: date, genre: booking.genre, expectedDraw: booking.expectedDraw, links: booking.links, techRider: booking.techRider, message: booking.message, contactDiscord: booking.contactDiscord })} /></div><BookingReviewNotePanel booking={booking} review={review} isSaving={updateReviewState.isLoading} onSaveReview={handleSaveReview} />{actionError && <div className="app-action-error" role="alert">{actionError}</div>}{actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}<div className="app-detail-actions"><Button variant="danger" iconLeft="x" onClick={() => setConfirmAction('decline')} disabled={booking.status !== SubmissionStatus.PENDING || declineState.isLoading}>Decline</Button><Button variant="success" iconLeft="check" onClick={() => setConfirmAction('approve')} disabled={booking.status !== SubmissionStatus.PENDING || approveState.isLoading}>Approve</Button></div></>}
    </AppShell>
  );
}
