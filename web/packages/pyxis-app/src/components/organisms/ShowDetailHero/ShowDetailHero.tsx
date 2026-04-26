import type { AppShow } from 'pyxis-types';
import { StatusDot } from '../../atoms/StatusDot';
import './ShowDetailHero.css';

export function ShowDetailHero({ show }: { show: AppShow }) {
  return (
    <section className="app-detail-hero" data-section="show-detail-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={show.status}/>{show.status}</span>
        <h1>{show.artist}</h1>
        <p>Fri, May 2, 2025 · Doors {show.doors} · {show.age}</p>
      </div>
      <div className="app-poster-placeholder">poster · 1080×1080</div>
    </section>
  );
}
