import { pyxisPart } from '../../../utils/parts';
import { clsx } from 'clsx';
import './PubFooter.css';

export type PubFooterProps = {
  className?: string;
  instagramUrl?: string;
  discordUrl?: string;
  mailingListUrl?: string;
  brand?: string;
  tagline?: string;
  address?: string;
};

const defaultLinks = {
  instagramUrl: 'https://www.instagram.com/ppxis.space/',
  discordUrl: 'https://discord.com/channels/586274407350272042',
  mailingListUrl: '#mailing-list',
};

export const PubFooter = ({ className, instagramUrl = defaultLinks.instagramUrl, discordUrl = defaultLinks.discordUrl, mailingListUrl = defaultLinks.mailingListUrl, brand = 'ppxis', tagline = 'a music artist space', address = '25 Manton Ave, Providence RI 02909' }: PubFooterProps) => (
  <footer className={clsx('pyxis-footer', className)} {...pyxisPart('pub-footer')}>
    <div className="pyxis-footer__inner" {...pyxisPart('pub-footer', 'inner')}>
      <div className="pyxis-footer__brand" {...pyxisPart('pub-footer', 'brand')}>
        <div {...pyxisPart('pub-footer', 'logo')}>{brand}</div>
        <div {...pyxisPart('pub-footer', 'tagline')}>
          {tagline}<br />{address}
        </div>
      </div>
      <div className="pyxis-footer__links" {...pyxisPart('pub-footer', 'links')}>
        <a href={instagramUrl} target="_blank" rel="noreferrer" {...pyxisPart('pub-footer', 'link')}>Instagram</a>
        <a href={discordUrl} target="_blank" rel="noreferrer" {...pyxisPart('pub-footer', 'link')}>Discord</a>
        <a href={mailingListUrl} {...pyxisPart('pub-footer', 'link')}>Mailing list</a>
      </div>
    </div>
  </footer>
);
