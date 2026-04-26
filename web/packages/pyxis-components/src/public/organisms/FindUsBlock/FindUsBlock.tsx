import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './FindUsBlock.css';

export type FindUsBlockProps = { className?: string };

export const FindUsBlock = ({ className }: FindUsBlockProps) => (
  <div {...pyxisPart('find-us-block')} className={clsx('pyxis-find-us-block', className)}>
    <div className="pyxis-find-us-block__heading" {...pyxisPart('find-us-block', 'heading')}>
      Find us
    </div>
    <div className="pyxis-find-us-block__body" {...pyxisPart('find-us-block', 'body')}>
      25 Manton Ave, Unit #2<br />
      Providence, RI 02909<br />
      <br />
      <span className="pyxis-find-us-block__email" {...pyxisPart('find-us-block', 'email')}>hello@ppxis.space</span><br />
      <span className="pyxis-find-us-block__email" {...pyxisPart('find-us-block', 'email')}>book@ppxis.space</span> — bookings<br />
      <br />
      <em className="pyxis-find-us-block__note" {...pyxisPart('find-us-block', 'note')}>
        we share a block with an auto body. buzzer on the right. steel door painted red.
      </em>
    </div>
  </div>
);
