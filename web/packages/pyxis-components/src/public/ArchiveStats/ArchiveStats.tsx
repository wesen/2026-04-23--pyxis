import type { ArchiveStats as ArchiveStatsData } from '../../mocks/types';
import { Stat } from '../../molecules/Stat';

export type ArchiveStatsProps = {
  stats: ArchiveStatsData;
  className?: string;
  'data-part'?: string;
};

export const ArchiveStats = ({ stats, className, 'data-part': dataPart }: ArchiveStatsProps) => (
  <div data-part={dataPart ?? 'archive-stats'} className={className} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
    <Stat label="Shows" value={stats.total_shows.toLocaleString()} sub="since day one" accentColor="var(--color-accent)" />
    <Stat label="Through the door" value={stats.total_attendance.toLocaleString()} sub="total attendance" accentColor="var(--color-accent)" />
    <Stat label="Years" value={stats.years_running} sub="and counting" accentColor="var(--color-accent)" />
    <Stat label="Unique artists" value={stats.unique_artists} sub="in the archive" accentColor="var(--color-accent)" />
  </div>
);
