import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import type { Show } from 'pyxis-types';
import './PubHero.css';

export type PubHeroProps = {
  show: Show;
  onShowClick?: (show: Show) => void;
  onTicketClick?: (show: Show) => void;
  className?: string;
};

export const PubHero = ({ show, onShowClick, className }: PubHeroProps) => (
  <section
    className={clsx('pyxis-pub-hero', className)}
    {...pyxisPart('pub-hero')}
    onClick={onShowClick ? () => onShowClick(show) : undefined}
    role={onShowClick ? 'button' : undefined}
    tabIndex={onShowClick ? 0 : undefined}
  >
    <div className="pyxis-pub-hero__date" {...pyxisPart('pub-hero', 'date')}>
      <div {...pyxisPart('pub-hero', 'month')}>Feb</div>
      <div {...pyxisPart('pub-hero', 'day')}>14</div>
    </div>
    <div className="pyxis-pub-hero__content" {...pyxisPart('pub-hero', 'content')}>
      <h2 {...pyxisPart('pub-hero', 'artist')}>{show.artist}</h2>
      <p {...pyxisPart('pub-hero', 'genre')}>{show.genre}</p>
      <div {...pyxisPart('pub-hero', 'meta')}>Doors {show.doorsTime} · {show.age} · {show.price}</div>
    </div>
  </section>
);
