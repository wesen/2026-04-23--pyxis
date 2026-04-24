import { pyxisPart } from '../../utils/parts';
export type StatProps = {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  accentColor?: string;
};
export const Stat = ({ label, value, sub, trend, accentColor = 'var(--color-accent)' }: StatProps) => (
  <div {...pyxisPart('stat')} style={{
    background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)', padding: '18px', position: 'relative', overflow: 'hidden',
  }}>
    <div {...pyxisPart('stat')} style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 2, background: accentColor, borderRadius: 'var(--radius-full)' }} />
    <div {...pyxisPart('stat')} style={{ paddingLeft: 8 }}>
      <div {...pyxisPart('stat')} style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>{label}</div>
      <div {...pyxisPart('stat')} style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, lineHeight: 1, marginTop: 6, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div {...pyxisPart('stat')} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 6 }}>{sub}</div>}
      {trend && <div {...pyxisPart('stat')} style={{ fontSize: 'var(--text-xs)', color: accentColor, marginTop: 4, fontWeight: 500 }}>{trend}</div>}
    </div>
  </div>
);
