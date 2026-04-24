import { pyxisPart } from '../../utils/parts';
export type VenueCardProps = {
  address?: string;
  capacity?: number;
  mapPlaceholder?: boolean;
  className?: string;
};
export const VenueCard = ({ className }: VenueCardProps) => (
  <aside {...pyxisPart('venue-card')} className={className} style={{ background: '#1F1E1C', color: '#E8E3D8', padding: 26, borderRadius: 6, fontSize: 13, lineHeight: 1.7, boxSizing: 'border-box' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: '-.02em', marginBottom: 14 }}>the space</div>
    <div style={{ color: '#BCB7AD' }}>150 standing · 80 seated</div>
  </aside>
);
