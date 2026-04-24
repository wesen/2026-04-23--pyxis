import { pyxisPart } from '../../utils/parts';
import type { LineupEntry } from '../../mocks/types';

export type LineupRowProps = {
  entry: LineupEntry;
  className?: string;
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

export const LineupRow = ({ entry, className }: LineupRowProps) => (
  <div className={className} {...pyxisPart('lineup-row')}>
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
