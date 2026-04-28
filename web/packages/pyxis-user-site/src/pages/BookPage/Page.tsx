import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookingForm,
  BookingSpaceAside,
  PublicPageHeader,
} from 'pyxis-components';
import type { BookingFormData } from 'pyxis-types';
import { getApiErrorMessage } from '../../api/errors';
import { usePublicSettings, useSubmitBooking } from '../../api/hooks';
import './Page.css';

export function Book() {
  const navigate = useNavigate();
  const submit = useSubmitBooking();
  const { data: settings } = usePublicSettings();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: BookingFormData) => {
    setSubmitError(null);
    try {
      await submit.mutateAsync(data);
      navigate('/book/success');
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <main className="pyxis-public-page pyxis-book-page" data-page="book">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-book-page__header" data-section="book-header">
          <PublicPageHeader kicker={settings?.bookingEmail || 'Inquiries'} title={`Book ${settings?.spaceName || 'the space'}`} />
        </header>

        <section className="pyxis-book-page__layout" data-section="book-layout">
          <div className="pyxis-book-page__form-column" data-section="book-form">
            {submitError && (
              <div className="pyxis-public-page__status" role="alert" data-section="book-submit-error">
                <p className="pyxis-public-page__status-message">Booking request failed.</p>
                <p className="pyxis-public-page__status-detail">{submitError}</p>
              </div>
            )}
            <BookingForm
              onSubmit={handleSubmit}
              isSubmitting={submit.isPending}
              visibleFields={{ genre: false, showType: true, techRider: false, agreement: true }}
            />
          </div>

          <aside className="pyxis-book-page__aside" data-section="book-aside">
            <BookingSpaceAside capacity={settings?.capacity || undefined} address={settings?.address || undefined} bookingEmail={settings?.bookingEmail || settings?.contactEmail || undefined} />
          </aside>
        </section>
      </div>
    </main>
  );
}
