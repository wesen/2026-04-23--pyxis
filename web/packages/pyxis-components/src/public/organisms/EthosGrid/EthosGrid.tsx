import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './EthosGrid.css';

export type EthosItem = {
  number: string;
  title: string;
  description: string;
};

export type EthosGridProps = {
  heading?: string;
  items?: EthosItem[];
  className?: string;
};

export const defaultEthosItems: EthosItem[] = [
  { number: '01', title: 'Artists first', description: 'we exist to book weird shows and pay the people who play them. 100% of door to artists for all local shows under 100 cap.' },
  { number: '02', title: 'A safer room', description: 'no racism, no transphobia, no bullshit. we enforce it. we mean it. the room has to be safe before it can be anything else.' },
  { number: '03', title: 'Loud by design', description: 'the PA is tuned for real volume. we honor ear protection (free at the door) and we start on time. respect the room, respect each other.' },
];

export const EthosGrid = ({ heading = 'Our ethos', items = defaultEthosItems, className }: EthosGridProps) => (
  <section {...pyxisPart('ethos-grid')} className={clsx('pyxis-ethos-grid', className)}>
    <div className="pyxis-ethos-grid__heading" {...pyxisPart('ethos-grid', 'heading')}>{heading}</div>
    <div className="pyxis-ethos-grid__grid" {...pyxisPart('ethos-grid', 'grid')}>
      {items.map(({ number, title, description }) => (
        <div key={number} className="pyxis-ethos-grid__item" {...pyxisPart('ethos-grid', 'item')}>
          <div {...pyxisPart('ethos-grid', 'number')}>{number}</div>
          <div {...pyxisPart('ethos-grid', 'title')}>{title}</div>
          <div {...pyxisPart('ethos-grid', 'description')}>{description}</div>
        </div>
      ))}
    </div>
  </section>
);
