import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import type { ArchiveStats as ArchiveStatsData } from 'pyxis-types';
import './ArchiveStats.css';

export type ArchiveStatsProps = {
  stats: ArchiveStatsData;
  className?: string;
};

export const ArchiveStats = ({ stats, className }: ArchiveStatsProps) => {
  const items = [
    { value: stats.totalShows.toLocaleString(), label: 'shows' },
    { value: stats.totalAttendance.toLocaleString(), label: 'artists' },
    { value: stats.yearsRunning.toLocaleString(), label: 'residencies' },
    { value: stats.uniqueArtists.toLocaleString(), label: 'cops called' },
  ];

  return (
    <div {...pyxisPart('archive-stats')} className={clsx('pyxis-archive-stats', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="pyxis-archive-stats__item"
          {...pyxisPart('archive-stats', 'item')}
        >
          <div
            className="pyxis-archive-stats__value"
            {...pyxisPart('archive-stats', 'value')}
          >
            {item.value}
          </div>
          <div
            className="pyxis-archive-stats__label"
            {...pyxisPart('archive-stats', 'label')}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
