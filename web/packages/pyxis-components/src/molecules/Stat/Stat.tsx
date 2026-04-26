import type { HTMLAttributes } from 'react';
import { pyxisPart } from '../../utils/parts';
export type StatProps = {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  accentColor?: string;
  className?: string;
  showAccent?: boolean;
  rootProps?: HTMLAttributes<HTMLDivElement>;
};
export const Stat = ({ label, value, sub, trend, accentColor = 'var(--color-accent)', className, showAccent = true, rootProps }: StatProps) => (
  <div {...pyxisPart('stat')} {...rootProps} className={className} style={{
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-xs)',
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {showAccent && <div {...pyxisPart('stat', 'accent')} style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 2, background: accentColor, borderRadius: 'var(--radius-full)' }} />}
    <div {...pyxisPart('stat', 'content')} style={{ paddingLeft: 8 }}>
      <div {...pyxisPart('stat', 'label')} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>{label}</div>
      <div {...pyxisPart('stat', 'value')} style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, lineHeight: 1, marginTop: 6, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div {...pyxisPart('stat', 'sub')} style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', marginTop: 6 }}>{sub}</div>}
      {trend && <div {...pyxisPart('stat', 'trend')} style={{ fontSize: 11, color: accentColor, marginTop: 4, fontWeight: 500 }}>{trend}</div>}
    </div>
  </div>
);
