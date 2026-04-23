import { useNavigate } from 'react-router-dom';
import { useSubmitBooking } from '../api/hooks';
import { BookingForm, SpaceInfo, BookingRules } from 'pyxis-components';

export function Book() {
  const navigate = useNavigate();
  const submit = useSubmitBooking();

  const handleSubmit = async (data: Parameters<typeof submit.mutateAsync>[0]) => {
    await submit.mutateAsync(data);
    navigate('/book/success');
  };

  return (
    <div data-page="book" style={{ maxWidth: 980, margin: '0 auto', padding: '48px 32px' }}>
      <div data-section="book-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48 }}>
        {/* Left: form */}
        <div data-section="book-form">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Book us
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 40 }}>
            We're always looking for interesting acts. If you've got something to bring,
            reach out.
          </p>
          <BookingForm
            onSubmit={handleSubmit}
            isSubmitting={submit.isPending}
          />
        </div>

        {/* Right: info */}
        <div data-section="book-info" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SpaceInfo />
          <BookingRules />
        </div>
      </div>
    </div>
  );
}
