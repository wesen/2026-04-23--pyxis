import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './ReserveTicketCard.css';

export type ReserveTicketCardProps = {
  code?: string;
  price?: string;
  note?: string;
  cta?: string;
  onReserve?: () => void;
  className?: string;
};

export const ReserveTicketCard = ({
  code = '№ 0214-A',
  price = '$10 – $15',
  note = 'sliding. cash or card at door.',
  cta = 'Reserve ticket →',
  onReserve,
  className,
}: ReserveTicketCardProps) => (
  <div {...pyxisPart('reserve-ticket-card')} className={clsx('pyxis-reserve-ticket-card', className)}>
    <div className="pyxis-reserve-ticket-card__header" {...pyxisPart('reserve-ticket-card', 'header')}>
      <span className="pyxis-reserve-ticket-card__eyebrow" {...pyxisPart('reserve-ticket-card', 'eyebrow')}>
        Ticket
      </span>
      <span className="pyxis-reserve-ticket-card__code" {...pyxisPart('reserve-ticket-card', 'code')}>
        {code}
      </span>
    </div>
    <div className="pyxis-reserve-ticket-card__price" {...pyxisPart('reserve-ticket-card', 'price')}>
      {price}
    </div>
    <div className="pyxis-reserve-ticket-card__note" {...pyxisPart('reserve-ticket-card', 'note')}>
      {note}
    </div>
    <button type="button" className="pyxis-reserve-ticket-card__cta" onClick={onReserve} {...pyxisPart('reserve-ticket-card', 'cta')}>
      {cta}
    </button>
  </div>
);
