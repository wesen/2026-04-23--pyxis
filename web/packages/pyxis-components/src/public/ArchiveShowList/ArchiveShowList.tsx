import { pyxisPart } from '../../utils/parts';
import { ArchiveShowRow } from '../ArchiveShowRow';
export type ArchiveShow = { date: string; name: string; tag: string };
export type ArchiveShowListProps = { shows?: ArchiveShow[]; className?: string };
export const ArchiveShowList = ({ shows = [{ date: 'Dec 12', name: 'Winter Solstice Rave', tag: 'Electronic' }, { date: 'Nov 29', name: 'Jake Meginsky · live', tag: 'Noise' }, { date: 'Nov 15', name: 'Bottom Feeders', tag: 'Hardcore' }], className }: ArchiveShowListProps) => (
  <div {...pyxisPart('archive-show-list')} className={className}>{shows.map((show) => <ArchiveShowRow key={`${show.date}-${show.name}`} {...show} />)}</div>
);
