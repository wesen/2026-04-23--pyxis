import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './VenueCard.css';

export type VenueCardProps = {
  address?: string;
  capacity?: number;
  mapPlaceholder?: boolean;
  className?: string;
};

export const VenueCard = ({ className }: VenueCardProps) => (
  <aside {...pyxisPart('venue-card')} className={clsx('pyxis-venue-card', className)}>
    <div className="pyxis-venue-card__title" {...pyxisPart('venue-card', 'title')}>
      the space
    </div>
    <div className="pyxis-venue-card__body" {...pyxisPart('venue-card', 'body')}>
      150 standing · 80 seated
    </div>
  </aside>
);
