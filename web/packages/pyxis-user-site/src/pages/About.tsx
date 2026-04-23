import { AboutHero, EthosStrip, Button } from 'pyxis-components';

export function About() {
  return (
    <div>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px' }}>
        <AboutHero />
      </div>

      {/* Hero image placeholder */}
      <div style={{ background: 'var(--color-border)', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-disabled)', marginBottom: 64 }}>
        [Hero image — venue interior]
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: 16 }}>What we do</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            Pyxis is a 150-capacity venue in the heart of Providence. We book underground,
            experimental, and boundary-pushing acts. Darkwave, noise, techno, ambient,
            EBM, industrial, experimental. The shows that other venues turn away.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: 16 }}>
            We've been running since 2021. Over {new Date().getFullYear() - 2021} years of weird shows.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: 16 }}>Visit</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 24px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <dt style={{ color: 'var(--color-text-tertiary)' }}>Address</dt>
            <dd>25 Manton Ave, Providence, RI 02909</dd>
            <dt style={{ color: 'var(--color-text-tertiary)' }}>Capacity</dt>
            <dd>~150</dd>
            <dt style={{ color: 'var(--color-text-tertiary)' }}>Contact</dt>
            <dd><a href="mailto:info@pyxis.xyz" style={{ color: 'var(--color-accent)' }}>info@pyxis.xyz</a></dd>
          </dl>
        </div>
      </div>

      <EthosStrip />

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '64px 32px', textAlign: 'center' }}>
        <Button variant="primary" iconRight="chevron-right">Book the space</Button>
      </div>
    </div>
  );
}
