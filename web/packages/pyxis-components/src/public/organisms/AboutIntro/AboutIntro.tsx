import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './AboutIntro.css';

export type AboutIntroProps = {
  lead?: string;
  paragraphs?: string[];
  className?: string;
};

export const defaultAboutIntroLead =
  'a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.';

export const defaultAboutIntroParagraphs = [
  'we opened in the fall of 2023 with one thing in mind: a room for the kind of shows providence keeps losing. dance nights that get to actually go, experimental sets that trust the audience, residencies that let a project grow over six months instead of six hours.',
  'we are a worker-run collective. we split door evenly. we do not book shows that conflict with our safer-space policy, and we do not tolerate bullshit at ours.',
];

export const AboutIntro = ({ lead = defaultAboutIntroLead, paragraphs = defaultAboutIntroParagraphs, className }: AboutIntroProps) => (
  <div {...pyxisPart('about-intro')} className={clsx('pyxis-about-intro', className)}>
    <p className="pyxis-about-intro__lead" {...pyxisPart('about-intro', 'lead')}>
      {lead}
    </p>
    {paragraphs.map((paragraph, index) => (
      <p key={`${index}-${paragraph.slice(0, 24)}`} className="pyxis-about-intro__body" {...pyxisPart('about-intro', 'body')}>
        {paragraph}
      </p>
    ))}
  </div>
);
