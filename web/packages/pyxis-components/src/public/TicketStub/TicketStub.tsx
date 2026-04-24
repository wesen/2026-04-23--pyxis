import { pyxisPart } from '../../utils/parts';
import type { Show } from '../../mocks/types';

export type TicketStubProps = {
  show: Show;
  className?: string;
};

export const TicketStub = ({ show, className }: TicketStubProps) => (
  <div
    className={className}
    {...pyxisPart('ticket-stub')}
    style={{
      border: '1px solid #EAE7E0',
      borderRadius: 4,
      background: '#fff',
      padding: 14,
      display: 'grid',
      gap: 8,
      boxSizing: 'border-box',
      color: '#1F1E1C',
    }}
  >
    <span style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8E887E', fontWeight: 600 }}>Admit one</span>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#C8270D', letterSpacing: '-.02em' }}>{show.artist}</span>
    <div style={{ height: 1, background: '#EAE7E0', margin: '2px 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E887E', fontSize: 12.5 }}>
      <span>{show.price}</span>
      <span>{show.age}</span>
    </div>
  </div>
);
