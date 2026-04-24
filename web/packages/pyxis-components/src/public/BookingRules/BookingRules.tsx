import { pyxisPart } from '../../utils/parts';
export type BookingRulesProps = {
  className?: string;
};
export const BookingRules = ({ className }: BookingRulesProps) => (
  <aside {...pyxisPart('booking-rules')} className={className} style={{ background: '#1F1E1C', color: '#E8E3D8', padding: 26, borderRadius: 6, fontSize: 13, lineHeight: 1.7, boxSizing: 'border-box' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: '-.02em', marginBottom: 14 }}>the space</div>
    <div style={{ color: '#BCB7AD' }}>we book 6–10 weeks out; late requests get the unused-dates list.</div>
  </aside>
);
