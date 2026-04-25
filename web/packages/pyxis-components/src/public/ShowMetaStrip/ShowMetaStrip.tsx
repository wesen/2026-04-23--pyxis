import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './ShowMetaStrip.css';

export type ShowMetaStripProps = {
  items?: Array<{ label: string; value: string }>;
  className?: string;
};

export const ShowMetaStrip = ({
  items = [
    { label: 'Doors', value: '9:00 PM' },
    { label: 'Age', value: '21+' },
    { label: 'Door', value: '$15' },
  ],
  className,
}: ShowMetaStripProps) => (
  <div
    {...pyxisPart('show-meta-strip')}
    className={clsx('pyxis-show-meta-strip', className)}
    style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` } as CSSProperties}
  >
    {items.map((item) => (
      <div key={item.label} className="pyxis-show-meta-strip__item" {...pyxisPart('show-meta-strip', 'item')}>
        <div className="pyxis-show-meta-strip__label" {...pyxisPart('show-meta-strip', 'label')}>
          {item.label}
        </div>
        <div className="pyxis-show-meta-strip__value" {...pyxisPart('show-meta-strip', 'value')}>
          {item.value}
        </div>
      </div>
    ))}
  </div>
);
