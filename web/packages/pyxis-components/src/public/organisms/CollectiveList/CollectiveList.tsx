import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './CollectiveList.css';

export type CollectiveMember = {
  name: string;
  role: string;
};

export type CollectiveListProps = {
  heading?: string;
  people?: CollectiveMember[];
  className?: string;
};

export const defaultCollectivePeople: CollectiveMember[] = [
  { name: 'shae m.', role: 'bookings, door' },
  { name: 'mhina j.', role: 'tech, lights' },
  { name: 'ro.', role: 'sound, residencies' },
  { name: 'devon k.', role: 'operations' },
  { name: 'emi p.', role: 'safer-space lead' },
];

export const CollectiveList = ({ heading = 'The collective', people = defaultCollectivePeople, className }: CollectiveListProps) => (
  <div {...pyxisPart('collective-list')} className={clsx('pyxis-collective-list', className)}>
    <div className="pyxis-collective-list__heading" {...pyxisPart('collective-list', 'heading')}>
      {heading}
    </div>
    <div className="pyxis-collective-list__list" {...pyxisPart('collective-list', 'list')}>
      {people.map(({ name, role }) => (
        <div key={`${name}-${role}`} className="pyxis-collective-list__item" {...pyxisPart('collective-list', 'item')}>
          <span {...pyxisPart('collective-list', 'name')}>{name}</span>
          <span {...pyxisPart('collective-list', 'role')}>{role}</span>
        </div>
      ))}
    </div>
  </div>
);
