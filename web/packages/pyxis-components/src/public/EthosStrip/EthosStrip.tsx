import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './EthosStrip.css';

export type EthosStripProps = { className?: string };

const ethosItems = [
  ['01', 'Artists first', 'we exist to book weird shows and pay the people who play them.'],
  ['02', 'A safer room', 'we exist to book weird shows and pay the people who play them.'],
  ['03', 'Loud by design', 'we exist to book weird shows and pay the people who play them.'],
];

export const EthosStrip = ({ className }: EthosStripProps) => (
  <div {...pyxisPart('ethos-strip')} className={clsx('pyxis-ethos-strip', className)}>
    <div className="pyxis-ethos-strip__heading" {...pyxisPart('ethos-strip', 'heading')}>Our ethos</div>
    <div className="pyxis-ethos-strip__grid" {...pyxisPart('ethos-strip', 'grid')}>
      {ethosItems.map(([num, title, desc]) => (
        <div key={num} className="pyxis-ethos-strip__item" {...pyxisPart('ethos-strip', 'item')}>
          <div {...pyxisPart('ethos-strip', 'number')}>{num}</div>
          <div {...pyxisPart('ethos-strip', 'title')}>{title}</div>
          <div {...pyxisPart('ethos-strip', 'description')}>{desc}</div>
        </div>
      ))}
    </div>
  </div>
);
