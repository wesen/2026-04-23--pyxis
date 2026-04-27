import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
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

function getRoleLabel(entry: LineupEntry) {
  if (entry.artist.toLowerCase() === 'doors' || entry.artist.toLowerCase() === 'close') return '';
  return roleLabels[entry.role];
}

export const LineupRow = ({ entry, className }: LineupRowProps) => {
  const roleLabel = getRoleLabel(entry);

  return (
    <div className={clsx('pyxis-lineup-row', className)} {...pyxisPart('lineup-row')}>
      <div className="pyxis-lineup-row__time" {...pyxisPart('lineup-row', 'time')}>
        {entry.startTime}
      </div>
      <div className="pyxis-lineup-row__artist-block" {...pyxisPart('lineup-row', 'artist-block')}>
        <span {...pyxisPart('lineup-row', 'artist')}>{entry.artist}</span>
        {roleLabel && (
          <div className="pyxis-lineup-row__role" {...pyxisPart('lineup-row', 'role')}>
            {roleLabel}
          </div>
        )}
      </div>
    </div>
  );
};
