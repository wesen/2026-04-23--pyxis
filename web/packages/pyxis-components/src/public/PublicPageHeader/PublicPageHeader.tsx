import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './PublicPageHeader.css';

export type PublicPageHeaderProps = {
  kicker: string;
  title: string;
  className?: string;
};

export const PublicPageHeader = ({ kicker, title, className }: PublicPageHeaderProps) => (
  <div {...pyxisPart('public-page-header')} className={clsx('pyxis-public-page-header', className)}>
    <div className="pyxis-public-page-header__kicker" {...pyxisPart('public-page-header', 'kicker')}>
      {kicker}
    </div>
    <h1 className="pyxis-public-page-header__title" {...pyxisPart('public-page-header', 'title')}>
      {title}
    </h1>
    <div className="pyxis-public-page-header__divider" {...pyxisPart('public-page-header', 'divider')} />
  </div>
);
