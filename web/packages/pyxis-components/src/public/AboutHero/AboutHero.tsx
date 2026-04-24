import { pyxisPart } from '../../utils/parts';
export type AboutHeroProps = {
  tagline?: string;
  className?: string;
};
export const AboutHero = ({ tagline = 'A room where the weird shows happen.', className }: AboutHeroProps) => (
  <div {...pyxisPart('about-hero')} className={className} style={{ padding: '48px 0 32px' }}>
    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', margin: '0 0 12px', letterSpacing: '0.04em' }}>Providence, Rhode Island · since 2021</p>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
      {tagline}
    </h1>
  </div>
);
