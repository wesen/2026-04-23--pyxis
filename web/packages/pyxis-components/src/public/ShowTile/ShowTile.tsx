import { pyxisPart } from '../../utils/parts';
import type { Show } from '../../mocks/types';
import { Poster, type PosterKind } from '../Poster';

export type ShowTileShow = Pick<Show, 'artist' | 'date' | 'doors_time' | 'price'> & { age: string; title?: string; time?: string; kind?: 'tickets' | 'soldout' | 'learn'; poster?: PosterKind };
export type ShowTileProps = { show: ShowTileShow; compact?: boolean; posterKind?: PosterKind; onClick?: () => void; className?: string };

const pillFor = (kind?: ShowTileShow['kind']) => kind === 'soldout'
  ? { label: 'Sold out', bg: '#F0EFEC', color: '#8E887E' }
  : kind === 'learn'
    ? { label: 'Learn more →', bg: '#FFF2EF', color: '#C8270D' }
    : { label: 'Tickets →', bg: '#FFF2EF', color: '#C8270D' };

const formatDate = (date: string) => date.includes('-')
  ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  : date;

export const ShowTile = ({ show, compact = false, posterKind, onClick, className }: ShowTileProps) => {
  const pill = pillFor(show.kind);
  const title = show.title ?? show.artist;
  const time = show.time ?? show.doors_time;
  return (
    <div className={className} {...pyxisPart('show-tile')} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Poster kind={posterKind ?? show.poster ?? 'redroom'} />
      <div {...pyxisPart('show-tile', 'info')} style={{ marginTop: 14 }}>
        <div {...pyxisPart('show-tile', 'title')} style={{ fontSize: compact ? 15 : 16, fontWeight: 700, color: '#C8270D', letterSpacing: '-.005em' }}>{title}</div>
        <div {...pyxisPart('show-tile', 'meta')} style={{ fontSize: 12.5, color: '#8E887E', marginTop: 4 }}>{formatDate(show.date)} · {time} · {show.age}</div>
        <div {...pyxisPart('show-tile', 'price')} style={{ fontSize: 12.5, color: '#8E887E', marginTop: 2 }}>{show.price}</div>
        <button {...pyxisPart('show-tile', 'ticket-pill')} style={{ background: pill.bg, color: pill.color, border: 'none', borderRadius: 999, padding: '5px 12px', fontSize: 11.5, fontWeight: 600, marginTop: 10, cursor: 'pointer', fontFamily: 'inherit' }}>{pill.label}</button>
      </div>
    </div>
  );
};
