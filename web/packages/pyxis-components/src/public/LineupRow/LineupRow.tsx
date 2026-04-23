import type { LineupEntry } from '../../mocks/types';

export type LineupRowProps = {
  entry: LineupEntry;
  className?: string;
  'data-part'?: string;
};

const roleColors: Record<LineupEntry['role'], string> = {
  headline: 'var(--color-accent)',
  support:  'var(--color-text-secondary)',
  dj:       'var(--color-info)',
};

const roleLabels: Record<LineupEntry['role'], string> = {
  headline: 'Headline',
  support:  'Support',
  dj:       'DJ',
};

export const LineupRow = ({ entry, className, 'data-part': dataPart }: LineupRowProps) => (
  <div className={className} data-part={dataPart ?? 'lineup-row'}>
    <span className="pyxis-lineup-row__time">{entry.start_time}</span>
    <span className="pyxis-lineup-row__artist">{entry.artist}</span>
    <span
      className="pyxis-lineup-row__role"
      style={{ color: roleColors[entry.role] }}
    >
      {roleLabels[entry.role]}
    </span>
  </div>
);
