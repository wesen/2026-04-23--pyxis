import { pyxisPart } from '../../utils/parts';
export type VenueCardProps = {
  address?: string;
  capacity?: number;
  mapPlaceholder?: boolean;
  className?: string;
};
export const VenueCard = ({ address, capacity = 150, mapPlaceholder, className }: VenueCardProps) => (
  <div {...pyxisPart('venue-card')} className={className} style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
    <h4 style={{ fontWeight: 600, margin: '0 0 8px' }}>Pyxis</h4>
    <p style={{ margin: '0 0 4px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{address ?? '25 Manton Ave, Providence, RI'}</p>
    <p style={{ margin: '0 0 12px', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>Capacity: ~{capacity}</p>
    {mapPlaceholder !== false && (
      <div style={{ height: 140, background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-disabled)', fontSize: 'var(--text-xs)' }}>
        Map placeholder
      </div>
    )}
  </div>
);
