import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './AboutHero.css';

export type AboutHeroProps = {
  tagline?: string;
  className?: string;
};

export const AboutHero = ({
  tagline = 'a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.',
  className,
}: AboutHeroProps) => (
  <div {...pyxisPart('about-hero')} className={clsx('pyxis-about-hero', className)}>
    <p className="pyxis-about-hero__eyebrow" {...pyxisPart('about-hero', 'eyebrow')}>Est. 2023</p>
    <h1 className="pyxis-about-hero__title" {...pyxisPart('about-hero', 'title')}>About ppxis</h1>
    <p className="pyxis-about-hero__tagline" {...pyxisPart('about-hero', 'tagline')}>{tagline}</p>
  </div>
);
