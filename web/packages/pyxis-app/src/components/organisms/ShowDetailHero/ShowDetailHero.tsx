import { AppShow, ShowStatus } from 'pyxis-types';
import type { StatusTone } from '../../atoms/StatusDot';
import { StatusDot } from '../../atoms/StatusDot';
import './ShowDetailHero.css';

function showStatusString(status: ShowStatus): string {
  const map: Record<ShowStatus, string> = {
    [ShowStatus.UNSPECIFIED]: 'Unspecified',
    [ShowStatus.CONFIRMED]: 'Confirmed',
    [ShowStatus.CANCELLED]: 'Cancelled',
    [ShowStatus.ARCHIVED]: 'Archived',
    [ShowStatus.DRAFT]: 'Draft',
    [ShowStatus.HOLD]: 'Hold',
    [ShowStatus.BLOCKED]: 'Blocked',
  };
  return map[status] ?? 'Unknown';
}

export type ShowDetailHeroProps = {
  show: AppShow;
  dateLabel?: string;
};

export function ShowDetailHero({ show, dateLabel = 'Fri, May 2, 2025' }: ShowDetailHeroProps) {
  return (
    <section className="app-detail-hero" data-section="show-detail-hero">
      <div>
        <span className="app-row-status"><StatusDot tone={showStatusString(show.status).toLowerCase() as StatusTone}/>{showStatusString(show.status)}</span>
        <h1>{show.artist}</h1>
        <p>{dateLabel} · Doors {show.doors} · {show.age}</p>
      </div>
      <div className="app-poster-placeholder">poster · 1080×1080</div>
    </section>
  );
}
