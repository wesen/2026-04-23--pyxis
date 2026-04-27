import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import type { Show } from 'pyxis-types';
import { Poster, type PosterKind } from '../Poster';
import './ShowTile.css';

export type ShowTileAction = 'tickets' | 'soldout' | 'learn';

export type ShowTileShow = Show & {
  title?: string;
  time?: string;
  kind?: ShowTileAction;
  poster?: PosterKind;
};

export type ShowTileProps = {
  show: ShowTileShow;
  compact?: boolean;
  posterKind?: PosterKind;
  onClick?: (show: ShowTileShow) => void;
  className?: string;
};

const pillFor = (kind?: ShowTileAction) => kind === 'soldout'
  ? { label: 'Sold out', bg: '#F0EFEC', color: '#8E887E' }
  : kind === 'learn'
    ? { label: 'Learn more →', bg: '#FFF2EF', color: '#C8270D' }
    : { label: 'Tickets →', bg: '#FFF2EF', color: '#C8270D' };

const formatDate = (date: string) => date.includes('-')
  ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  : date;

const formatMeta = (show: ShowTileShow, time?: string) => [
  formatDate(show.date),
  show.genre,
  time,
  show.age,
].filter(Boolean).join(' · ');

const posterFor = (show: ShowTileShow): PosterKind => {
  if (show.poster) return show.poster;

  const artist = show.artist.toLowerCase();
  if (artist.includes('808')) return 'pixel808';
  if (artist.includes('petals')) return 'petals';
  if (artist.includes('meet')) return 'meetups';
  if (artist.includes('basement')) return 'basement';
  if (artist.includes('orphx')) return 'orphx';
  if (artist.includes('moor')) return 'moor';
  if (artist.includes('cygnus')) return 'cygnus';
  if (artist.includes('zola')) return 'zola';

  return 'redroom';
};

const kindFor = (show: ShowTileShow): ShowTileShow['kind'] => {
  const artist = show.artist.toLowerCase();
  if (artist.includes('monday') || artist.includes('meet-up')) return 'learn';
  if (artist.includes('moor mother')) return 'soldout';
  return 'tickets';
};

const isMockPlaceholderFlyer = (url?: string) => Boolean(url?.includes('placehold.co/'));

export const ShowTile = ({ show, compact = false, posterKind, onClick, className }: ShowTileProps) => {
  const pill = pillFor(show.kind ?? kindFor(show));
  const title = show.title ?? show.artist;
  const time = show.time ?? show.doorsTime;
  const flyerUrl = isMockPlaceholderFlyer(show.flyerUrl) ? undefined : show.flyerUrl;
  const style = {
    '--pyxis-show-tile-pill-bg': pill.bg,
    '--pyxis-show-tile-pill-color': pill.color,
  } as CSSProperties;

  return (
    <div
      className={clsx('pyxis-show-tile', className)}
      {...pyxisPart('show-tile')}
      data-show-id={show.id}
      data-compact={compact ? 'true' : undefined}
      onClick={onClick ? () => onClick(show) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {flyerUrl ? <img className="pyxis-show-tile__flyer" src={flyerUrl} alt={`${title} flyer`} /> : <Poster kind={posterKind ?? posterFor(show)} />}
      <div className="pyxis-show-tile__info" {...pyxisPart('show-tile', 'info')}>
        <div className="pyxis-show-tile__title" {...pyxisPart('show-tile', 'title')}>
          {title}
        </div>
        <div className="pyxis-show-tile__meta" {...pyxisPart('show-tile', 'meta')}>
          {formatMeta(show, time)}
        </div>
        <div className="pyxis-show-tile__price" {...pyxisPart('show-tile', 'price')}>
          {show.price}
        </div>
        <button className="pyxis-show-tile__ticket-pill" {...pyxisPart('show-tile', 'ticket-pill')}>
          {pill.label}
        </button>
      </div>
    </div>
  );
};
