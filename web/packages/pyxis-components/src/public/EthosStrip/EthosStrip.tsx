export type EthosStripProps = {
  className?: string;
  'data-part'?: string;
};
export const EthosStrip = ({ className, 'data-part': dataPart }: EthosStripProps) => (
  <div data-part={dataPart ?? 'ethos-strip'} className={className} style={{ background: 'var(--color-ink)', color: 'var(--color-text-inverse)', padding: '48px 32px' }}>
    <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
      {[
        { num: '01', title: 'Artists first', desc: 'We take care of our artists. Sound, hospitality, audience — we work to make every show worth the trip.' },
        { num: '02', title: 'Room for risk', desc: 'We book weird. Experimental, confrontational, boundary-pushing work is what we\'re here for.' },
        { num: '03', title: 'All ages when we can', desc: 'Accessibility matters. All ages shows when we can, 21+ when we have to.' },
      ].map(item => (
        <div key={item.num}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '0.08em', marginBottom: 8 }}>{item.num}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, margin: '0 0 8px' }}>{item.title}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-inverse-muted)', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
