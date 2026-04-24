import { pyxisPart } from '../../utils/parts';
export type ShowDetailHeaderProps = { meta?: string; title?: string; description?: string; className?: string };
export const ShowDetailHeader = ({ meta = 'Fri · Feb 14 · 2026 · 9PM', title = 'Redroom Inferno', description = "A Dusknight residency. A kink, electronica & queer music party — the room turns red, the floor turns into cinder, and we don't stop 'til dawn.", className }: ShowDetailHeaderProps) => (
  <header {...pyxisPart('show-detail-header')} className={className}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#C8270D', textTransform: 'uppercase', marginBottom: 10 }}>{meta}</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 500, fontStyle: 'italic', letterSpacing: '-.03em', lineHeight: 1, margin: 0, color: '#C8270D' }}>{title}</h1>
    <div style={{ fontSize: 14, color: '#8E887E', marginTop: 14, fontStyle: 'italic', lineHeight: 1.6, maxWidth: 480 }}>{description}</div>
  </header>
);
