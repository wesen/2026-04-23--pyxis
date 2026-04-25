import { useNavigate } from 'react-router-dom';
import {
  BookingForm,
  BookingRules,
  BookingSpaceAside,
  PublicPageHeader,
  SaferSpaceAgreement,
} from 'pyxis-components';
import type { BookingFormData } from 'pyxis-types';
import { useSubmitBooking } from '../api/hooks';
import './Book.css';

export function Book() {
  const navigate = useNavigate();
  const submit = useSubmitBooking();

  const handleSubmit = async (data: BookingFormData) => {
    await submit.mutateAsync(data);
    navigate('/book/success');
  };

  return (
    <main className="pyxis-public-page pyxis-book-page" data-page="book">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-book-page__header" data-section="book-header">
          <PublicPageHeader kicker="booking" title="Book us" />
        </header>

        <section className="pyxis-book-page__layout" data-section="book-layout">
          <div className="pyxis-book-page__form-column" data-section="book-form">
            <BookingForm onSubmit={handleSubmit} isSubmitting={submit.isPending} />
          </div>

          <aside className="pyxis-book-page__aside" data-section="book-aside">
            <BookingSpaceAside />
            <BookingRules />
            <SaferSpaceAgreement />
          </aside>
        </section>
      </div>
    </main>
  );
}
