import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './BookingRules.css';

export type BookingRulesProps = {
  className?: string;
};

export const BookingRules = ({ className }: BookingRulesProps) => (
  <aside {...pyxisPart('booking-rules')} className={clsx('pyxis-booking-rules', className)}>
    <div className="pyxis-booking-rules__title" {...pyxisPart('booking-rules', 'title')}>
      the space
    </div>
    <div className="pyxis-booking-rules__body" {...pyxisPart('booking-rules', 'body')}>
      we book 6–10 weeks out; late requests get the unused-dates list.
    </div>
  </aside>
);
