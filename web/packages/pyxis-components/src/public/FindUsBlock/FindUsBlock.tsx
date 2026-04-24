import { pyxisPart } from '../../utils/parts';
export const FindUsBlock = ({ className }: { className?: string }) => (
  <div {...pyxisPart('find-us-block')} className={className}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', marginBottom: 10 }}>Find us</div>
    <div style={{ fontSize: 14, color: '#4A463E', lineHeight: 1.8 }}>25 Manton Ave, Unit #2<br/>Providence, RI 02909<br/><br/><span style={{ color: '#C8270D' }}>hello@ppxis.space</span><br/><span style={{ color: '#C8270D' }}>book@ppxis.space</span> — bookings<br/><br/><em style={{ color: '#8E887E' }}>we share a block with an auto body. buzzer on the right. steel door painted red.</em></div>
  </div>
);
