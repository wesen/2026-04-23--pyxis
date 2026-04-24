import { pyxisPart } from '../../utils/parts';
export type PublicPageHeaderProps = { kicker: string; title: string; className?: string };
export const PublicPageHeader = ({ kicker, title, className }: PublicPageHeaderProps) => (
  <div {...pyxisPart('public-page-header')} className={className} style={{ marginBottom: 32 }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', marginBottom: 10 }}>{kicker}</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.05, margin: 0, color: '#C8270D' }}>{title}</h1>
    <div style={{ height: 1, background: '#EAE7E0', marginTop: 28 }} />
  </div>
);
