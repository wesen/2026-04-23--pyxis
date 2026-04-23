import { Button } from '../../atoms/Button';
import type { Show } from '../../mocks/types';

export type PubHeroProps = {
  show: Show;
  onShowClick?: (show: Show) => void;
  onTicketClick?: (show: Show) => void;
  className?: string;
  'data-part'?: string;
};

const fmtFull = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export const PubHero = ({ show, onShowClick, onTicketClick, className, 'data-part': dataPart }: PubHeroProps) => (
  <section className={className} data-part={dataPart ?? 'pub-hero'} onClick={onShowClick ? () => onShowClick(show) : undefined} role={onShowClick ? 'button' : undefined} tabIndex={onShowClick ? 0 : undefined} style={{ cursor: onShowClick ? 'pointer' : 'default' }}>
    <div className="pyxis-hero__inner">
      {/* Date block */}
      <div className="pyxis-hero__date" aria-label={`Date: ${fmtFull(show.date)}`}>
        <span className="pyxis-hero__month">
          {new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="pyxis-hero__day">
          {new Date(show.date + 'T00:00:00').getDate()}
        </span>
      </div>
      {/* Content */}
      <div className="pyxis-hero__content">
        <h2 className="pyxis-hero__artist">{show.artist}</h2>
        <p className="pyxis-hero__genre">{show.genre}</p>
        <div className="pyxis-hero__meta">
          <span>Doors {show.doors_time}</span>
          <span>·</span>
          <span>{show.age}</span>
          <span>·</span>
          <span>{show.price}</span>
        </div>
        {show.description && <p className="pyxis-hero__desc">{show.description}</p>}
        <div className="pyxis-hero__actions">
          <Button variant="primary" iconRight="chevron-right" onClick={() => onTicketClick?.(show)}>
            Get tickets
          </Button>
          <Button variant="outline" iconLeft="calendar">Add to calendar</Button>
        </div>
      </div>
    </div>
  </section>
);
