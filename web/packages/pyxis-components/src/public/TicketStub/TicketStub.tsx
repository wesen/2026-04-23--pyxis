import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import type { Show } from '../../mocks/types';
import './TicketStub.css';

export type TicketStubProps = {
  show: Show;
  className?: string;
};

export const TicketStub = ({ show, className }: TicketStubProps) => (
  <div className={clsx('pyxis-ticket-stub', className)} {...pyxisPart('ticket-stub')}>
    <span className="pyxis-ticket-stub__eyebrow" {...pyxisPart('ticket-stub', 'eyebrow')}>
      Admit one
    </span>
    <span className="pyxis-ticket-stub__title" {...pyxisPart('ticket-stub', 'title')}>
      {show.artist}
    </span>
    <div className="pyxis-ticket-stub__divider" {...pyxisPart('ticket-stub', 'divider')} />
    <div className="pyxis-ticket-stub__meta" {...pyxisPart('ticket-stub', 'meta')}>
      <span {...pyxisPart('ticket-stub', 'price')}>{show.price}</span>
      <span {...pyxisPart('ticket-stub', 'age')}>{show.age}</span>
    </div>
  </div>
);
