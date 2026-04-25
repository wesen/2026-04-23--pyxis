import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './AboutIntro.css';

export type AboutIntroProps = { className?: string };

export const AboutIntro = ({ className }: AboutIntroProps) => (
  <div {...pyxisPart('about-intro')} className={clsx('pyxis-about-intro', className)}>
    <p className="pyxis-about-intro__lead" {...pyxisPart('about-intro', 'lead')}>
      a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.
    </p>
    <p className="pyxis-about-intro__body" {...pyxisPart('about-intro', 'body')}>
      we opened in the fall of 2023 with one thing in mind: a room for the kind of shows providence keeps losing. dance nights that get to actually go, experimental sets that trust the audience.
    </p>
    <p className="pyxis-about-intro__body" {...pyxisPart('about-intro', 'body')}>
      we are a worker-run collective. we split door evenly. we do not book shows that conflict with our safer-space policy.
    </p>
  </div>
);
