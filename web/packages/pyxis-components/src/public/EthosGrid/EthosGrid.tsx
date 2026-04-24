import { pyxisPart } from '../../utils/parts';
export const EthosGrid = ({ className }: { className?: string }) => (
  <section {...pyxisPart('ethos-grid')} className={className} style={{ borderTop: '1px solid #EAE7E0', paddingTop: 36 }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', marginBottom: 28 }}>Our ethos</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>{[['01','Artists first'],['02','A safer room'],['03','Loud by design']].map(([n,h]) => <div key={n}><div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 500, fontStyle: 'italic', color: '#C8270D', lineHeight: 1, letterSpacing: '-.02em' }}>{n}</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: '#C8270D', marginTop: 10, letterSpacing: '-.015em' }}>{h}</div><div style={{ fontSize: 13, color: '#4A463E', lineHeight: 1.65, marginTop: 8 }}>we exist to book weird shows and pay the people who play them.</div></div>)}</div>
  </section>
);
