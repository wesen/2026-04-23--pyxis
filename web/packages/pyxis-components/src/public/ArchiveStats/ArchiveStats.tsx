import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import type { ArchiveStats as ArchiveStatsData } from '../../mocks/types';
import './ArchiveStats.css';

export type ArchiveStatsProps = {
  stats: ArchiveStatsData;
  className?: string;
};

export const ArchiveStats = ({ stats, className }: ArchiveStatsProps) => {
  const items = [
    { value: stats.total_shows.toLocaleString(), label: 'shows' },
    { value: stats.total_attendance.toLocaleString(), label: 'artists' },
    { value: stats.years_running.toLocaleString(), label: 'residencies' },
    { value: stats.unique_artists.toLocaleString(), label: 'cops called' },
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
