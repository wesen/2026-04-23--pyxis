import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './EthosGrid.css';

export type EthosGridProps = { className?: string };

const ethosItems = [['01', 'Artists first'], ['02', 'A safer room'], ['03', 'Loud by design']];

export const EthosGrid = ({ className }: EthosGridProps) => (
  <section {...pyxisPart('ethos-grid')} className={clsx('pyxis-ethos-grid', className)}>
    <div className="pyxis-ethos-grid__heading" {...pyxisPart('ethos-grid', 'heading')}>Our ethos</div>
    <div className="pyxis-ethos-grid__grid" {...pyxisPart('ethos-grid', 'grid')}>
      {ethosItems.map(([number, title]) => (
        <div key={number} className="pyxis-ethos-grid__item" {...pyxisPart('ethos-grid', 'item')}>
          <div {...pyxisPart('ethos-grid', 'number')}>{number}</div>
          <div {...pyxisPart('ethos-grid', 'title')}>{title}</div>
          <div {...pyxisPart('ethos-grid', 'description')}>we exist to book weird shows and pay the people who play them.</div>
        </div>
      ))}
    </div>
  </section>
);
