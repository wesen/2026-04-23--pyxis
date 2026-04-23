import 'react';
export type LogRowProps = {
  artist: string;
  role: 'headline' | 'support' | 'dj';
  startTime: string;
};
const roleColors = { headline: 'var(--color-accent)', support: 'var(--color-text-secondary)', dj: 'var(--color-info)' };
const roleLabels = { headline: 'Headline', support: 'Support', dj: 'DJ' };
export const LogRow = ({ artist, role, startTime }: LogRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
    <span style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{startTime}</span>
    <span style={{ flex: 1, fontWeight: 500 }}>{artist}</span>
    <span style={{ fontSize: 'var(--text-xs)', color: roleColors[role], fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{roleLabels[role]}</span>
  </div>
);
