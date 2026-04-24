import { pyxisPart } from '../../utils/parts';
export type ShowMetaStripProps = { items?: Array<{ label: string; value: string }>; className?: string };
export const ShowMetaStrip = ({ items = [{ label: 'Doors', value: '9:00 PM' }, { label: 'Age', value: '21+' }, { label: 'Door', value: '$15' }], className }: ShowMetaStripProps) => (
  <div {...pyxisPart('show-meta-strip')} className={className} style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 0, borderTop: '1px solid #EAE7E0', borderBottom: '1px solid #EAE7E0' }}>
    {items.map((item) => <div key={item.label} style={{ padding: '14px 0' }}><div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8E887E', fontWeight: 600 }}>{item.label}</div><div style={{ fontSize: 15, fontWeight: 500, color: '#C8270D', marginTop: 4 }}>{item.value}</div></div>)}
  </div>
);
