import { pyxisPart } from '../../utils/parts';
import type { Show } from '../../mocks/types';

export type TicketStubProps = {
  show: Show;
  className?: string;
};

export const TicketStub = ({ show, className }: TicketStubProps) => (
  <div className={className} {...pyxisPart('ticket-stub')}>
    <div className="pyxis-ticket-stub__inner">
      <span className="pyxis-ticket-stub__admit">Admit one</span>
      <span className="pyxis-ticket-stub__artist">{show.artist}</span>
      <div className="pyxis-ticket-stub__divider" />
      <span className="pyxis-ticket-stub__price">{show.price}</span>
      <span className="pyxis-ticket-stub__age">{show.age}</span>
    </div>
  </div>
);
