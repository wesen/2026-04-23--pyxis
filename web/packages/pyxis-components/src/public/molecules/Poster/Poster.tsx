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

  if (kind === 'pixel808') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__pixel808-art" {...pyxisPart('poster', 'pixel808-art')}>
          <div className="pyxis-poster__pixel808-bars">{['#E24A2E', '#F26B1F', '#F39020', '#F1B51D', '#FDD835', '#fff'].map((color) => <span key={color} style={{ background: color }} />)}</div>
          <div className="pyxis-poster__pixel808-rule" />
          <div className="pyxis-poster__pixel808-spacer" />
          <div className="pyxis-poster__pixel808-title">808</div>
          <div className="pyxis-poster__pixel808-copy">The heart of the beat<br />that changed music</div>
          <div className="pyxis-poster__pixel808-accent" />
        </div>
      </div>
    );
  }

  if (kind === 'petals') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__petals-art" {...pyxisPart('poster', 'petals-art')}>
          <div className="pyxis-poster__petals-intro">DyvynHER Collective · Delightful Intentions</div>
          <div className="pyxis-poster__petals-presents">Presents</div>
          <div className="pyxis-poster__petals-title">Petals of Love</div>
          <div className="pyxis-poster__petals-heart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path d="M50 85 C20 60, 10 35, 28 22 C40 14, 50 28, 50 28 C50 28, 60 14, 72 22 C90 35, 80 60, 50 85Z" fill="#E55770" /></svg>
            <div className="pyxis-poster__petals-heart-text">Join us for an evening of community, connection, crafts and making floral bouquets honoring love in all its forms.<strong>ALL SUPPLIES PROVIDED</strong><small>MOCKTAILS AND LIGHT FARE PROVIDED<br />(WHILE SUPPLIES LAST)</small><b>13<sup>th</sup></b><em>6:30 PM<br />EVENTBRITE LINK IN BIO</em></div>
          </div>
          <div className="pyxis-poster__petals-bottom"><span>ATTIRE<br />SPECIAL OCCASION<br />DRESS-TO-IMPRESS</span><span>LOCATION<br />ppxis<br />25 MANTON AVE,<br />PROVIDENCE, RI 02909</span></div>
        </div>
      </div>
    );
  }

  if (kind === 'basement') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__basement-art" {...pyxisPart('poster', 'basement-art')}>
          <div><div className="pyxis-poster__basement-title">Basement<br />Frequencies</div><div className="pyxis-poster__basement-sub">an underground electronic night<br />heavy bass · dark vibes.</div></div>
          <div className="pyxis-poster__basement-skull"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#5A0707" strokeWidth=".6" />{Array.from({ length: 48 }).map((_, i) => { const a = (i / 48) * Math.PI * 2; return <line key={i} x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46} stroke="#7A1010" strokeWidth=".5" />; })}<ellipse cx="50" cy="45" rx="18" ry="22" fill="#2A2A28" /><circle cx="42" cy="46" r="5" fill="#E84545" /><circle cx="58" cy="46" r="5" fill="#E84545" /></svg></div>
          <div className="pyxis-poster__basement-meta"><b>Feb 28th, 2026</b><br />Doors 9:30pm · ppxis<br />25 Manton Ave, Providence RI<br />21+ · $12</div>
        </div>
      </div>
    );
  }

  if (kind === 'orphx') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__orphx-art" {...pyxisPart('poster', 'orphx-art')}><div><div className="pyxis-poster__orphx-title">ORPHX</div><div className="pyxis-poster__orphx-sub">industrial / ebm<br />live performance</div></div><svg className="pyxis-poster__orphx-figure" viewBox="0 0 100 120"><path d="M30 120 L25 60 Q25 35 50 30 Q75 35 75 60 L70 120 Z" fill="#0A0A0A" stroke="#2A2A28" strokeWidth=".5"/><ellipse cx="50" cy="54" rx="14" ry="18" fill="#1A1A18"/><path d="M38 50 Q50 44 62 50 L62 66 Q50 72 38 66 Z" fill="#0A0A0A"/></svg><div className="pyxis-poster__orphx-meta">JULY 4TH, 2026<br /><span>PPXIS · 9PM · 18+ · $12</span></div></div>
      </div>
    );
  }

  if (kind === 'cygnus') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__cygnus-art" {...pyxisPart('poster', 'cygnus-art')}><div className="pyxis-poster__cygnus-lines" /><div className="pyxis-poster__cygnus-content"><div className="pyxis-poster__cygnus-kicker">//TECHNO</div><div><div className="pyxis-poster__cygnus-title">CYGNUS</div><div className="pyxis-poster__cygnus-guests">+ guests TBA</div></div><div className="pyxis-poster__cygnus-meta">MAY.17 · 9PM<br /><span>PPXIS · 18+ · $8</span></div></div></div>
      </div>
    );
  }

  if (kind === 'zola') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__zola-art" {...pyxisPart('poster', 'zola-art')}><div className="pyxis-poster__zola-frame" /><div className="pyxis-poster__zola-kicker">an evening with</div><div><div className="pyxis-poster__zola-title">Zola<br />Jesus</div><div className="pyxis-poster__zola-sub">· art pop / darkwave ·</div></div><div className="pyxis-poster__zola-meta">JUNE 6 · 2025<br /><span>PPXIS · 8PM · 21+ · $20</span></div></div>
      </div>
    );
  }

  if (kind === 'moor') {
    return (
      <div className={clsx('pyxis-poster', className)} {...pyxisPart('poster')} data-poster-kind={kind} style={posterStyle}>
        <div className="pyxis-poster__moor-art" {...pyxisPart('poster', 'moor-art')}><div className="pyxis-poster__moor-kicker">ppxis presents</div><div><div className="pyxis-poster__moor-title">Moor<br />Mother</div><div className="pyxis-poster__moor-sub">— noise poetry —</div></div><div className="pyxis-poster__moor-meta">MAY 9 · 2025<br /><span>DOORS 7PM · ALL AGES · $15</span></div></div>
      </div>
    );
  }

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
