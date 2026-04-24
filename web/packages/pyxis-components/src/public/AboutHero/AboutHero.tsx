import { pyxisPart } from '../../utils/parts';
export type AboutHeroProps = {
  tagline?: string;
  className?: string;
};
export const AboutHero = ({ tagline = 'a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.', className }: AboutHeroProps) => (
  <div {...pyxisPart('about-hero')} className={className} style={{ padding: '48px 0 32px' }}>
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', margin: '0 0 10px' }}>Est. 2023</p>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.05, margin: 0, color: '#C8270D' }}>About ppxis</h1>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-.015em', lineHeight: 1.3, color: '#C8270D', margin: '28px 0 0' }}>{tagline}</p>
  </div>
);
