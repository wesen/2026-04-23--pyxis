import { pyxisPart } from '../../utils/parts';
import type { LineupEntry } from '../../mocks/types';

export type LineupRowProps = {
  entry: LineupEntry;
  className?: string;
};

const roleLabels: Record<LineupEntry['role'], string> = {
  headline: 'headline · dj set',
  support:  'opener · dj set',
  dj:       'dj set',
};

export const LineupRow = ({ entry, className }: LineupRowProps) => (
  <div
    className={className}
    {...pyxisPart('lineup-row')}
    style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr',
      borderTop: '1px solid #EAE7E0',
      fontSize: 14,
      color: '#1F1E1C',
    }}
  >
    <div style={{ padding: '12px 12px 12px 0', color: '#8E887E', fontVariantNumeric: 'tabular-nums', verticalAlign: 'top' }}>{entry.start_time}</div>
    <div style={{ padding: '12px 0', color: '#C8270D', fontWeight: 600, verticalAlign: 'top' }}>
      {entry.artist}
      <div style={{ fontSize: 11.5, color: '#8E887E', fontWeight: 400, marginTop: 2, fontStyle: 'italic' }}>{roleLabels[entry.role]}</div>
    </div>
  </div>
);
