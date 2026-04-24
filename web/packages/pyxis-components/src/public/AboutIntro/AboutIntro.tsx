import { pyxisPart } from '../../utils/parts';
export const AboutIntro = ({ className }: { className?: string }) => (
  <div {...pyxisPart('about-intro')} className={className} style={{ maxWidth: 620 }}>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-.015em', lineHeight: 1.3, color: '#C8270D', margin: '0 0 28px' }}>a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.</p>
    <p style={{ fontSize: 14.5, color: '#4A463E', lineHeight: 1.75, margin: '0 0 16px' }}>we opened in the fall of 2023 with one thing in mind: a room for the kind of shows providence keeps losing. dance nights that get to actually go, experimental sets that trust the audience.</p>
    <p style={{ fontSize: 14.5, color: '#4A463E', lineHeight: 1.75, margin: '0 0 16px' }}>we are a worker-run collective. we split door evenly. we do not book shows that conflict with our safer-space policy.</p>
  </div>
);
