import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './CollectiveList.css';

export type CollectiveListProps = { className?: string };

const people = [
  ['shae m.', 'bookings, door'],
  ['mhina j.', 'bookings, door'],
  ['ro.', 'bookings, door'],
];

export const CollectiveList = ({ className }: CollectiveListProps) => (
  <div {...pyxisPart('collective-list')} className={clsx('pyxis-collective-list', className)}>
    <div className="pyxis-collective-list__heading" {...pyxisPart('collective-list', 'heading')}>
      The collective
    </div>
    <div className="pyxis-collective-list__list" {...pyxisPart('collective-list', 'list')}>
      {people.map(([name, role]) => (
        <div key={name} className="pyxis-collective-list__item" {...pyxisPart('collective-list', 'item')}>
          <span {...pyxisPart('collective-list', 'name')}>{name}</span>
          <span {...pyxisPart('collective-list', 'role')}>{role}</span>
        </div>
      ))}
    </div>
  </div>
);
