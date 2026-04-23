import { Button } from '../../atoms/Button';

export type BookingSuccessProps = {
  artistName?: string;
  onSubmitAnother?: () => void;
  className?: string;
  'data-part'?: string;
};

export const BookingSuccess = ({ artistName, onSubmitAnother, className, 'data-part': dataPart }: BookingSuccessProps) => (
  <div data-part={dataPart ?? 'booking-success'} className={className} style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{ width: 56, height: 56, background: 'var(--color-success-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
      <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 10.5 4 4 8-9" />
      </svg>
    </div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, margin: '0 0 8px' }}>
      Inquiry sent{artistName ? ` — ${artistName}` : ''}
    </h2>
    <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 24px' }}>
      We'll be in touch within a week or two. Check your email for a confirmation.
    </p>
    <Button variant="outline" onClick={onSubmitAnother}>Submit another</Button>
  </div>
);
