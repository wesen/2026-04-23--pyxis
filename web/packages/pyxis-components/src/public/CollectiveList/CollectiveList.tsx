import { pyxisPart } from '../../utils/parts';
export const CollectiveList = ({ className }: { className?: string }) => {
  const people = [['shae m.','bookings, door'],['mhina j.','tech, lights'],['ro.','sound, residencies'],['devon k.','operations'],['emi p.','safer-space lead']];
  return <div {...pyxisPart('collective-list')} className={className}><div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', marginBottom: 10 }}>The collective</div><div style={{ display: 'grid', gap: 8 }}>{people.map(([n,r]) => <div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, borderBottom: '1px solid #EAE7E0', padding: '9px 0' }}><span style={{ color: '#C8270D' }}>{n}</span><span style={{ color: '#8E887E', fontStyle: 'italic' }}>{r}</span></div>)}</div></div>;
};
