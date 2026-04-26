import { pyxisPart } from '../../../utils/parts';
import { clsx } from 'clsx';
import './PubFooter.css';

export type PubFooterProps = {
  className?: string;
};

export const PubFooter = ({ className }: PubFooterProps) => (
  <footer className={clsx('pyxis-footer', className)} {...pyxisPart('pub-footer')}>
    <div className="pyxis-footer__inner" {...pyxisPart('pub-footer', 'inner')}>
      <div className="pyxis-footer__brand" {...pyxisPart('pub-footer', 'brand')}>
        <div {...pyxisPart('pub-footer', 'logo')}>ppxis</div>
        <div {...pyxisPart('pub-footer', 'tagline')}>
          a music artist space<br />25 Manton Ave, Providence RI 02909
        </div>
      </div>
      <div className="pyxis-footer__links" {...pyxisPart('pub-footer', 'links')}>
        {['Instagram', 'Discord', 'Mailing list'].map((label) => (
          <a key={label} href="#" {...pyxisPart('pub-footer', 'link')}>{label}</a>
        ))}
      </div>
    </div>
  </footer>
);
