import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import { ArchiveShowRow } from '../ArchiveShowRow';
import './ArchiveShowList.css';

export type ArchiveShow = {
  date: string;
  name: string;
  tag: string;
  href?: string;
};

export type ArchiveShowListProps = {
  shows?: ArchiveShow[];
  className?: string;
};

const defaultShows: ArchiveShow[] = [
  { date: 'Dec 12', name: 'Winter Solstice Rave', tag: 'Electronic' },
  { date: 'Nov 29', name: 'Jake Meginsky · live', tag: 'Noise' },
  { date: 'Nov 15', name: 'Bottom Feeders', tag: 'Hardcore' },
];

export const ArchiveShowList = ({ shows = defaultShows, className }: ArchiveShowListProps) => (
  <div {...pyxisPart('archive-show-list')} className={clsx('pyxis-archive-show-list', className)}>
    {shows.map((show) => (
      <ArchiveShowRow key={`${show.date}-${show.name}`} {...show} />
    ))}
  </div>
);
