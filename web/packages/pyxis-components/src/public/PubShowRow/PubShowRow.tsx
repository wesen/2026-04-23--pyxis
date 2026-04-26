import { pyxisPart } from '../../utils/parts';
import type { Show } from 'pyxis-types';

export type PubShowRowProps = {
  show: Show;
  onClick?: (show: Show) => void;
  className?: string;
};

export const PubShowRow = ({ show, onClick, className }: PubShowRowProps) => {
  const month = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
  const day = new Date(show.date + 'T00:00:00').getDate();

  return (
    <article
      className={className}
      {...pyxisPart('pub-show-row')}
      onClick={onClick ? () => onClick(show) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Date block */}
      <div className="pyxis-show-row__date" aria-label={show.date}>
        <span className="pyxis-show-row__month">{month}</span>
        <span className="pyxis-show-row__day">{day}</span>
      </div>
      {/* Info */}
      <div className="pyxis-show-row__info">
        <h3 className="pyxis-show-row__artist">{show.artist}</h3>
        <p className="pyxis-show-row__genre">{show.genre}</p>
        <p className="pyxis-show-row__doors">Doors {show.doorsTime}</p>
      </div>
      {/* Price + CTA */}
      <div className="pyxis-show-row__right">
        <span className="pyxis-show-row__price">{show.price}</span>
        <span className="pyxis-show-row__age">{show.age}</span>
      </div>
    </article>
  );
};
