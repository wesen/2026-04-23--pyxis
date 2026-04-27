import { AppShow } from 'pyxis-types';
import { StatusDot, statusToLabel } from '../../../atoms/StatusDot';
import './ShowDetailHero.css';

export type ShowDetailHeroProps = {
  show: AppShow;
  dateLabel?: string;
};

export function ShowDetailHero({ show, dateLabel = 'Fri, May 2, 2025' }: ShowDetailHeroProps) {
  return (
    <section className="app-detail-hero" data-section="show-detail-hero">
      <div>
        <span className="app-row-status"><StatusDot status={show.status} />{statusToLabel(show.status)}</span>
        <h1>{show.artist}</h1>
        <p>{dateLabel} · Doors {show.doors} · {show.age}</p>
      </div>
      <div className="app-poster-placeholder">poster · 1080×1080</div>
    </section>
  );
}
