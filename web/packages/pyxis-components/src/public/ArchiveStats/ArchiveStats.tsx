import { pyxisPart } from '../../utils/parts';
import type { ArchiveStats as ArchiveStatsData } from '../../mocks/types';

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
    <div
      {...pyxisPart('archive-stats')}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 32,
        padding: '18px 0',
        borderTop: '1px solid #EAE7E0',
        borderBottom: '1px solid #EAE7E0',
        color: '#1F1E1C',
        boxSizing: 'content-box',
      }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <div
            style={{
              fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 34,
              fontWeight: 600,
              color: '#C8270D',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#8E887E',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
