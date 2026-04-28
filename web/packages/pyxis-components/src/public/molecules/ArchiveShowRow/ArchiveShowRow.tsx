import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './ArchiveShowRow.css';

export type ArchiveShowRowProps = {
  date: string;
  name: string;
  tag: string;
  href?: string;
  onNavigate?: (href: string) => void;
  className?: string;
};

export const ArchiveShowRow = ({
  date,
  name,
  tag,
  href = '#',
  onNavigate,
  className,
}: ArchiveShowRowProps) => (
  <a
    href={href}
    {...pyxisPart('archive-show-row')}
    className={clsx('pyxis-archive-show-row', className)}
    onClick={(event) => {
      if (!onNavigate || href === '#' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      onNavigate(href);
    }}
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
