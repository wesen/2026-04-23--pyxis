import { pyxisPart } from '../../utils/parts';
export const BookingSpaceAside = ({ className }: { className?: string }) => (
  <aside {...pyxisPart('booking-space-aside')} className={className} style={{ background: '#1F1E1C', color: '#E8E3D8', padding: 26, borderRadius: 6, fontSize: 13, lineHeight: 1.7 }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: '-.02em', marginBottom: 14 }}>the space</div>
    <div style={{ display: 'grid', gap: 12, fontSize: 12.5, color: '#BCB7AD' }}>{[['Capacity','150 standing · 80 seated'],['PA','Funktion-One F1201, 4-way · 2× Sub infra 108'],['Backline','CDJ-3000 ×2, DJM-900, Moog Sub37, house drum kit'],['Tech','projector, haze, moving heads ×4, basic video chain'],['Hours','close by 2 AM (3 on Sat)']].map(([k,v]) => <div key={k}><div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8E887E', marginBottom: 3 }}>{k}</div>{v}</div>)}</div>
    <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #3A3733', fontSize: 11.5, color: '#8E887E', fontStyle: 'italic' }}>25 Manton Ave · Providence RI 02909<br/><span style={{ color: '#E8E3D8', fontStyle: 'normal' }}>book@ppxis.space</span></div>
  </aside>
);
