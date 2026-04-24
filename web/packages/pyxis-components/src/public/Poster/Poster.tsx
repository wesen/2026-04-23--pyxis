import { pyxisPart } from '../../utils/parts';

export type PosterKind = 'redroom' | 'pixel808' | 'petals' | 'meetups' | 'basement' | 'orphx' | 'moor' | 'cygnus' | 'zola';

export type PosterProps = {
  kind?: PosterKind;
  ratio?: string;
  className?: string;
};

const variants: Record<PosterKind, { bg: string; fg: string; accent: string; title: string; kicker: string; meta: string; mark: string }> = {
  redroom: { bg: 'radial-gradient(ellipse at 50% 40%, #7A0E0E 0%, #3D0505 60%, #1A0202 100%)', fg: '#FFD9C8', accent: '#E84545', title: 'Redroom Inferno', kicker: 'A Dusknight residency at ppxis', meta: 'Feb. 14th, 2026 · 21+ · $10 – $15', mark: '♡' },
  pixel808: { bg: '#0B0B0B', fg: '#fff', accent: '#F39020', title: '808', kicker: 'The heart of the beat', meta: 'Fri Feb 21 · 8PM · 21+', mark: '▮▮▮' },
  petals: { bg: '#F8C9D0', fg: '#7A2233', accent: '#E55770', title: 'Petals of Love', kicker: 'DyvynHER Collective presents', meta: 'Feb 28 · 6:30 PM · All Ages', mark: '♥' },
  meetups: { bg: '#9FD8D4', fg: '#1A1A1A', accent: '#F6A25B', title: 'Monday Meet-ups', kicker: 'Club club', meta: 'Mondays 7p – 10p', mark: '$0–30' },
  basement: { bg: '#0D0D0D', fg: '#E8E3D8', accent: '#E84545', title: 'Basement Frequencies', kicker: 'underground electronic night', meta: 'Feb 28 · 9:30PM · 21+', mark: '☠' },
  orphx: { bg: 'radial-gradient(ellipse at 50% 30%, #252523 0%, #0A0A0A 80%)', fg: '#fff', accent: '#fff', title: 'ORPHX', kicker: 'industrial / ebm', meta: 'July 4 · 9PM · 18+', mark: '▲' },
  moor: { bg: 'linear-gradient(180deg, #2A1B3D 0%, #6B1F47 50%, #C14B51 100%)', fg: '#FFEAD8', accent: '#FFEAD8', title: 'Moor Mother', kicker: 'ppxis presents', meta: 'May 9 · all ages · $15', mark: '—' },
  cygnus: { bg: 'repeating-linear-gradient(0deg, rgba(100,200,255,.15) 0 1px, #000 1px 3px)', fg: '#fff', accent: '#5EE0FF', title: 'CYGNUS', kicker: '//TECHNO', meta: 'May 17 · 9PM · 18+', mark: '+ guests' },
  zola: { bg: 'linear-gradient(180deg, #1A0D1C 0%, #3D1A2E 100%)', fg: '#F5E8D8', accent: '#F5E8D8', title: 'Zola Jesus', kicker: 'an evening with', meta: 'June 6 · 8PM · 21+', mark: '✦' },
};

export const Poster = ({ kind = 'redroom', ratio = '4 / 5', className }: PosterProps) => {
  const v = variants[kind] ?? variants.redroom;
  return (
    <div className={className} {...pyxisPart('poster')} data-poster-kind={kind} style={{ position: 'relative', width: '100%', aspectRatio: ratio, borderRadius: 4, overflow: 'hidden', background: '#111' }}>
      <div {...pyxisPart('poster', 'art')} style={{ position: 'absolute', inset: 0, background: v.bg, color: v.fg, fontFamily: "var(--font-display), Fraunces, Georgia, serif", padding: '18px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center', boxSizing: 'border-box' }}>
        <div>
          <div {...pyxisPart('poster', 'kicker')} style={{ fontSize: 9, letterSpacing: '.15em', opacity: .65, textTransform: 'uppercase', fontStyle: 'italic' }}>{v.kicker}</div>
          <div {...pyxisPart('poster', 'title')} style={{ fontSize: kind === 'pixel808' ? 56 : kind === 'orphx' ? 44 : 24, fontWeight: 700, fontStyle: 'italic', marginTop: 8, color: v.accent, letterSpacing: '-.04em', lineHeight: .95 }}>{v.title}</div>
        </div>
        <div {...pyxisPart('poster', 'mark')} style={{ fontSize: kind === 'redroom' ? 48 : 34, color: v.accent, opacity: .75, fontWeight: 800, lineHeight: 1 }}>{v.mark}</div>
        <div {...pyxisPart('poster', 'meta')} style={{ fontSize: 8, opacity: .72, letterSpacing: '.04em' }}>{v.meta}<br />25 Manton Ave, Providence RI</div>
      </div>
    </div>
  );
};
