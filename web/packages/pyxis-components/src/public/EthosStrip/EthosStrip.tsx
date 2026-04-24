import { pyxisPart } from '../../utils/parts';
export type EthosStripProps = {
  className?: string;
};
export const EthosStrip = ({ className }: EthosStripProps) => (
  <div {...pyxisPart('ethos-strip')} className={className} style={{ marginTop: 56, borderTop: '1px solid #EAE7E0', paddingTop: 36 }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#8E887E', textTransform: 'uppercase', marginBottom: 28 }}>Our ethos</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      {[
        ['01', 'Artists first', 'we exist to book weird shows and pay the people who play them.'],
        ['02', 'A safer room', 'we exist to book weird shows and pay the people who play them.'],
        ['03', 'Loud by design', 'we exist to book weird shows and pay the people who play them.'],
      ].map(([num, title, desc]) => (
        <div key={num}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 500, fontStyle: 'italic', color: '#C8270D', lineHeight: 1, letterSpacing: '-.02em' }}>{num}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: '#C8270D', marginTop: 10, letterSpacing: '-.015em' }}>{title}</div>
          <div style={{ fontSize: 13, color: '#4A463E', lineHeight: 1.65, marginTop: 8 }}>{desc}</div>
        </div>
      ))}
    </div>
  </div>
);
