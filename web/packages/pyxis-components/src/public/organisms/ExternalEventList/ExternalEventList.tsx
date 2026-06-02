import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import { ExternalEventCard } from '../../molecules/ExternalEventCard';
import type { ExternalEvent } from 'pyxis-types';
import './ExternalEventList.css';

export type ExternalEventListProps = {
  events: ExternalEvent[];
  className?: string;
};

export const ExternalEventList = ({ events, className }: ExternalEventListProps) => (
  <div
    className={clsx('pyxis-external-event-list', className)}
    {...pyxisPart('external-event-list')}
  >
    {events.map((event) => (
      <ExternalEventCard key={event.id} event={event} />
    ))}
  </div>
);
