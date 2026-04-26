import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './ArchiveShowRow.css';

export type ArchiveShowRowProps = {
  date: string;
  name: string;
  tag: string;
  href?: string;
  className?: string;
};

export const ArchiveShowRow = ({
  date,
  name,
  tag,
  href = '#',
  className,
}: ArchiveShowRowProps) => (
  <a
    href={href}
    {...pyxisPart('archive-show-row')}
    className={clsx('pyxis-archive-show-row', className)}
  >
    <div className="pyxis-archive-show-row__date" {...pyxisPart('archive-show-row', 'date')}>
      {date}
    </div>
    <div className="pyxis-archive-show-row__name" {...pyxisPart('archive-show-row', 'name')}>
      {name}
    </div>
    <div className="pyxis-archive-show-row__tag" {...pyxisPart('archive-show-row', 'tag')}>
      {tag}
    </div>
    <div className="pyxis-archive-show-row__cta" {...pyxisPart('archive-show-row', 'cta')}>
      recap →
    </div>
  </a>
);
