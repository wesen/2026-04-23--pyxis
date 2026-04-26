import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import type { Show_LineupEntry as LineupEntry } from 'pyxis-types';
import './LineupRow.css';

export type LineupRowProps = {
  entry: LineupEntry;
  className?: string;
};

const roleLabels: Record<LineupEntry['role'], string> = {
  headline: 'headline · dj set',
  support: 'opener · dj set',
  dj: 'dj set',
};

export const LineupRow = ({ entry, className }: LineupRowProps) => (
  <div className={clsx('pyxis-lineup-row', className)} {...pyxisPart('lineup-row')}>
    <div className="pyxis-lineup-row__time" {...pyxisPart('lineup-row', 'time')}>
      {entry.startTime}
    </div>
    <div className="pyxis-lineup-row__artist-block" {...pyxisPart('lineup-row', 'artist-block')}>
      <span {...pyxisPart('lineup-row', 'artist')}>{entry.artist}</span>
      <div className="pyxis-lineup-row__role" {...pyxisPart('lineup-row', 'role')}>
        {roleLabels[entry.role]}
      </div>
    </div>
  </div>
);
