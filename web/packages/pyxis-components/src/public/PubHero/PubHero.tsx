import { pyxisPart } from '../../utils/parts';
import type { Show } from '../../mocks/types';

export type PubHeroProps = {
  show: Show;
  onShowClick?: (show: Show) => void;
  onTicketClick?: (show: Show) => void;
  className?: string;
};

export const PubHero = ({ show, onShowClick, className }: PubHeroProps) => (
  <section
    className={className}
    {...pyxisPart('pub-hero')}
    onClick={onShowClick ? () => onShowClick(show) : undefined}
    role={onShowClick ? 'button' : undefined}
    tabIndex={onShowClick ? 0 : undefined}
    style={{ borderTop: '1px solid #EAE7E0', padding: '24px 0', display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, cursor: onShowClick ? 'pointer' : 'default' }}
  >
    <div style={{ color: '#8E887E', fontVariantNumeric: 'tabular-nums' }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.12em' }}>Feb</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: '#C8270D', lineHeight: 1 }}>14</div>
    </div>
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, letterSpacing: '-.025em', margin: '0 0 6px', color: '#C8270D' }}>{show.artist}</h2>
      <p style={{ fontSize: 13, color: '#8E887E', margin: '0 0 12px' }}>{show.genre}</p>
      <div style={{ fontSize: 12.5, color: '#8E887E' }}>Doors {show.doors_time} · {show.age} · {show.price}</div>
    </div>
  </section>
);
