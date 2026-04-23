import { PyxisLogo } from '../../atoms/Icon';

export type PubFooterProps = {
  className?: string;
  'data-part'?: string;
};

export const PubFooter = ({ className, 'data-part': dataPart }: PubFooterProps) => (
  <footer className={className} data-part={dataPart ?? 'pub-footer'}>
    <div className="pyxis-footer__inner">
      <div className="pyxis-footer__brand">
        <PyxisLogo size={20} />
        <p className="pyxis-footer__tagline">A room where the weird shows happen.</p>
      </div>
      <div className="pyxis-footer__links">
        <a href="/shows">Shows</a>
        <a href="/archive">Archive</a>
        <a href="/book">Book us</a>
        <a href="/about">About</a>
      </div>
      <p className="pyxis-footer__copy">© {new Date().getFullYear()} Pyxis. Providence, RI.</p>
    </div>
  </footer>
);
