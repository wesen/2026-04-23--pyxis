import { clsx } from 'clsx';

export type PubFooterProps = {
  className?: string;
  'data-part'?: string;
};

export const PubFooter = ({ className, 'data-part': dataPart }: PubFooterProps) => (
  <footer
    className={clsx('pyxis-footer', className)}
    data-part={dataPart ?? 'pub-footer'}
    style={{ borderTop: '1px solid #EAE7E0', marginTop: 60, padding: '28px 32px' }}
  >
    <div
      className="pyxis-footer__inner"
      style={{ maxWidth: 920, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}
    >
      <div className="pyxis-footer__brand">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', color: '#1F1E1C' }}>ppxis</div>
        <div style={{ fontSize: 11.5, color: '#8E887E', fontStyle: 'italic', lineHeight: 1.65, marginTop: 4 }}>
          a music artist space<br />25 Manton Ave, Providence RI 02909
        </div>
      </div>
      <div className="pyxis-footer__links" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {['Instagram', 'Discord', 'Mailing list'].map((label) => (
          <a key={label} href="#" style={{ fontSize: 13, color: '#8E887E', textDecoration: 'none' }}>{label}</a>
        ))}
      </div>
    </div>
  </footer>
);
