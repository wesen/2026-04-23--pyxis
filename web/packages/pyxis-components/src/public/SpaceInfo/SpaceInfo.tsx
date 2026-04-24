import { pyxisPart } from '../../utils/parts';
export type SpaceInfoProps = {
  address?: string;
  capacity?: number;
  email?: string;
  className?: string;
};
export const SpaceInfo = ({ address, capacity = 150, email = 'info@pyxis.xyz', className }: SpaceInfoProps) => (
  <div {...pyxisPart('space-info')} className={className} style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, margin: '0 0 12px', fontSize: 'var(--text-lg)' }}>The Space</h4>
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px', fontSize: 'var(--text-sm)' }}>
      <dt style={{ color: 'var(--color-text-tertiary)' }}>Address</dt>
      <dd style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{address ?? '25 Manton Ave, Providence, RI'}</dd>
      <dt style={{ color: 'var(--color-text-tertiary)' }}>Capacity</dt>
      <dd style={{ margin: 0, color: 'var(--color-text-secondary)' }}>~{capacity}</dd>
      <dt style={{ color: 'var(--color-text-tertiary)' }}>Contact</dt>
      <dd style={{ margin: 0 }}>
        <a href={`mailto:${email}`} style={{ color: 'var(--color-accent)' }}>{email}</a>
      </dd>
    </dl>
  </div>
);
