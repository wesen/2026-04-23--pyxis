import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import { Button } from '../../../atoms/Button';
import './BookingSuccess.css';

export type BookingSuccessProps = {
  artistName?: string;
  onSubmitAnother?: () => void;
  className?: string;
};

export const BookingSuccess = ({ artistName, onSubmitAnother, className }: BookingSuccessProps) => (
  <div {...pyxisPart('booking-success')} className={clsx('pyxis-booking-success', className)}>
    <div className="pyxis-booking-success__icon" {...pyxisPart('booking-success', 'icon')}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m4 10.5 4 4 8-9" />
      </svg>
    </div>
    <h2 className="pyxis-booking-success__title" {...pyxisPart('booking-success', 'title')}>
      Inquiry sent{artistName ? ` — ${artistName}` : ''}
    </h2>
    <p className="pyxis-booking-success__message" {...pyxisPart('booking-success', 'message')}>
      We'll be in touch within a week or two. Check your email for a confirmation.
    </p>
    <div className="pyxis-booking-success__actions" {...pyxisPart('booking-success', 'actions')}>
      <Button variant="outline" onClick={onSubmitAnother}>Submit another</Button>
    </div>
  </div>
);
