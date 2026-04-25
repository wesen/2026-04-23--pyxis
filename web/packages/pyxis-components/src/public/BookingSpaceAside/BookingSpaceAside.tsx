import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './BookingSpaceAside.css';

export type BookingSpaceAsideProps = {
  className?: string;
};

const specs = [
  ['Capacity', '150 standing · 80 seated'],
  ['PA', 'Funktion-One F1201, 4-way · 2× Sub infra 108'],
  ['Backline', 'CDJ-3000 ×2, DJM-900, Moog Sub37, house drum kit'],
  ['Tech', 'projector, haze, moving heads ×4, basic video chain'],
  ['Hours', 'close by 2 AM (3 on Sat)'],
];

export const BookingSpaceAside = ({ className }: BookingSpaceAsideProps) => (
  <aside {...pyxisPart('booking-space-aside')} className={clsx('pyxis-booking-space-aside', className)}>
    <div className="pyxis-booking-space-aside__title" {...pyxisPart('booking-space-aside', 'title')}>
      the space
    </div>
    <div className="pyxis-booking-space-aside__spec-list" {...pyxisPart('booking-space-aside', 'spec-list')}>
      {specs.map(([label, value]) => (
        <div key={label} className="pyxis-booking-space-aside__spec" {...pyxisPart('booking-space-aside', 'spec')}>
          <div className="pyxis-booking-space-aside__spec-label" {...pyxisPart('booking-space-aside', 'spec-label')}>
            {label}
          </div>
          <div className="pyxis-booking-space-aside__spec-value" {...pyxisPart('booking-space-aside', 'spec-value')}>
            {value}
          </div>
        </div>
      ))}
    </div>
    <div className="pyxis-booking-space-aside__footer" {...pyxisPart('booking-space-aside', 'footer')}>
      25 Manton Ave · Providence RI 02909
      <br />
      <span className="pyxis-booking-space-aside__email" {...pyxisPart('booking-space-aside', 'email')}>
        book@ppxis.space
      </span>
    </div>
  </aside>
);
