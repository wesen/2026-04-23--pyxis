import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './ShowDetailHeader.css';

export type ShowDetailHeaderProps = {
  meta?: string;
  title?: string;
  description?: string;
  className?: string;
};

export const ShowDetailHeader = ({
  meta = 'Fri · Feb 14 · 2026 · 9PM',
  title = 'Redroom Inferno',
  description = "A Dusknight residency. A kink, electronica & queer music party — the room turns red, the floor turns into cinder, and we don't stop 'til dawn.",
  className,
}: ShowDetailHeaderProps) => (
  <header {...pyxisPart('show-detail-header')} className={clsx('pyxis-show-detail-header', className)}>
    <div className="pyxis-show-detail-header__meta" {...pyxisPart('show-detail-header', 'meta')}>
      {meta}
    </div>
    <h1 className="pyxis-show-detail-header__title" {...pyxisPart('show-detail-header', 'title')}>
      {title}
    </h1>
    <div className="pyxis-show-detail-header__description" {...pyxisPart('show-detail-header', 'description')}>
      {description}
    </div>
  </header>
);
