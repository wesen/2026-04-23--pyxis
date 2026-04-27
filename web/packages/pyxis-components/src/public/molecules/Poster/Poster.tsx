import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './Poster.css';

export type PosterKind = 'redroom' | 'pixel808' | 'petals' | 'meetups' | 'basement' | 'orphx' | 'moor' | 'cygnus' | 'zola';

export type PosterProps = {
  kind?: PosterKind;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
};

const variants: Record<PosterKind, { bg: string; fg: string; accent: string; title: string; kicker: string; meta: string; mark: string; subtitle?: string }> = {
  redroom: { bg: 'radial-gradient(ellipse at 50% 40%, #7A0E0E 0%, #3D0505 60%, #1A0202 100%)', fg: '#FFD9C8', accent: '#E84545', title: 'Redroom Inferno', kicker: 'A Dusknight residency at ppxis', subtitle: 'A Kink · Electronica · Queer Music Party', meta: 'Feb. 14th, 2026', mark: '♡' },
  pixel808: { bg: '#0B0B0B', fg: '#fff', accent: '#F39020', title: '808', kicker: 'The heart of the beat', meta: 'Fri Feb 21 · 8PM · 21+', mark: '▮▮▮' },
  petals: { bg: '#F8C9D0', fg: '#7A2233', accent: '#E55770', title: 'Petals of Love', kicker: 'DyvynHER Collective presents', meta: 'Feb 28 · 6:30 PM · All Ages', mark: '♥' },
  meetups: { bg: '#9FD8D4', fg: '#1A1A1A', accent: '#F6A25B', title: 'Monday Meet-ups', kicker: 'Club club', meta: 'Mondays 7p – 10p', mark: '$0–30' },
  basement: { bg: '#0D0D0D', fg: '#E8E3D8', accent: '#E84545', title: 'Basement Frequencies', kicker: 'underground electronic night', meta: 'Feb 28 · 9:30PM · 21+', mark: '☠' },
  orphx: { bg: 'radial-gradient(ellipse at 50% 30%, #252523 0%, #0A0A0A 80%)', fg: '#fff', accent: '#fff', title: 'ORPHX', kicker: 'industrial / ebm', meta: 'July 4 · 9PM · 18+', mark: '▲' },
  moor: { bg: 'linear-gradient(180deg, #2A1B3D 0%, #6B1F47 50%, #C14B51 100%)', fg: '#FFEAD8', accent: '#FFEAD8', title: 'Moor Mother', kicker: 'ppxis presents', meta: 'May 9 · all ages · $15', mark: '—' },
  cygnus: { bg: 'repeating-linear-gradient(0deg, rgba(100,200,255,.15) 0 1px, #000 1px 3px)', fg: '#fff', accent: '#5EE0FF', title: 'CYGNUS', kicker: '//TECHNO', meta: 'May 17 · 9PM · 18+', mark: '+ guests' },
  zola: { bg: 'linear-gradient(180deg, #1A0D1C 0%, #3D1A2E 100%)', fg: '#F5E8D8', accent: '#F5E8D8', title: 'Zola Jesus', kicker: 'an evening with', meta: 'June 6 · 8PM · 21+', mark: '✦' },
};

export const Poster = ({ kind = 'redroom', ratio = '4 / 5', className, style }: PosterProps) => {
  const v = variants[kind] ?? variants.redroom;
  const posterStyle = {
    '--pyxis-poster-bg': v.bg,
    '--pyxis-poster-fg': v.fg,
    '--pyxis-poster-accent': v.accent,
    '--pyxis-poster-ratio': ratio,
    ...style,
  } as CSSProperties;

  if (kind === 'meetups') {
    return (
      <div
        className={clsx('pyxis-poster', className)}
        {...pyxisPart('poster')}
        data-poster-kind={kind}
        style={posterStyle}
      >
        <div className="pyxis-poster__meetups-art" {...pyxisPart('poster', 'meetups-art')}>
          <div className="pyxis-poster__meetups-top">
            <div className="pyxis-poster__meetups-badge">
              <span>CLUB</span>
              <span>CLUB</span>
            </div>
            <div className="pyxis-poster__meetups-heading">MONDAY<br />MEET-UPS</div>
          </div>
          <div className="pyxis-poster__meetups-copy">
            Come <mark>explore</mark> DJ gear, instruments, and <mark>make pals</mark>! Just sign up and hop in!
          </div>
          <div className="pyxis-poster__meetups-gear-row">
            <div className="pyxis-poster__meetups-gear">
              <span />
              <span />
            </div>
            <div className="pyxis-poster__meetups-note">
              <mark>No experience necessary!</mark> This is a place of learning! :)
            </div>
          </div>
          <div className="pyxis-poster__meetups-footer">
            Mondays 7p – 10p<br />25 Manton Ave. · Unit #2<br />Providence, RI 02999
            <div className="pyxis-poster__meetups-sticker">$0 - 30<br />sliding<br />scale!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx('pyxis-poster', className)}
      {...pyxisPart('poster')}
      data-poster-kind={kind}
      style={posterStyle}
    >
      <div className="pyxis-poster__art" {...pyxisPart('poster', 'art')}>
        <div className="pyxis-poster__header" {...pyxisPart('poster', 'header')}>
          <div className="pyxis-poster__kicker" {...pyxisPart('poster', 'kicker')}>
            {v.kicker}
          </div>
          <div className="pyxis-poster__title" {...pyxisPart('poster', 'title')}>
            {v.title}
          </div>
          {v.subtitle && (
            <div className="pyxis-poster__subtitle" {...pyxisPart('poster', 'subtitle')}>
              {v.subtitle}
            </div>
          )}
        </div>
        <div className="pyxis-poster__mark" {...pyxisPart('poster', 'mark')}>
          {v.mark}
        </div>
        {kind === 'redroom' ? (
          <div className="pyxis-poster__meta" {...pyxisPart('poster', 'meta')}>
            <div className="pyxis-poster__meta-date" {...pyxisPart('poster', 'meta-date')}>
              {v.meta}
            </div>
            <div className="pyxis-poster__meta-line" {...pyxisPart('poster', 'meta-line')} data-emphasis="location">
              25 Manton Ave, Providence RI
            </div>
            <div className="pyxis-poster__meta-line" {...pyxisPart('poster', 'meta-line')}>
              21+ · tickets available online ($10 – $15)
            </div>
            <div className="pyxis-poster__meta-line" {...pyxisPart('poster', 'meta-line')} data-emphasis="policy">
              No Photography · or · Video Recording · Allowed
            </div>
          </div>
        ) : (
          <div className="pyxis-poster__meta" {...pyxisPart('poster', 'meta')}>
            {v.meta}
            <br />
            25 Manton Ave, Providence RI
          </div>
        )}
      </div>
    </div>
  );
};
