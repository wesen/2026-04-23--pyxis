import { clsx } from 'clsx';
import type { Show_LineupEntry as LineupEntry } from 'pyxis-types';
import { pyxisPart } from '../../../utils/parts';
import { LineupRow } from '../../molecules/LineupRow';
import './ShowLineup.css';

export type ShowLineupProps = {
  entries: LineupEntry[];
  title?: string;
  className?: string;
};

export const ShowLineup = ({ entries, title = 'Lineup', className }: ShowLineupProps) => {
  if (entries.length === 0) return null;

  return (
    <section {...pyxisPart('show-lineup')} className={clsx('pyxis-show-lineup', className)} data-section="show-detail-lineup">
      <h2 className="pyxis-show-lineup__title" {...pyxisPart('show-lineup', 'title')}>
        {title}
      </h2>
      <div className="pyxis-show-lineup__rows" {...pyxisPart('show-lineup', 'rows')}>
        {entries.map((entry) => (
          <LineupRow key={`${entry.artist}-${entry.startTime}`} entry={entry} />
        ))}
      </div>
    </section>
  );
};
