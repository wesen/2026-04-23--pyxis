import { pyxisPart } from '../../utils/parts';
import { ShowTile, type ShowTileShow } from '../ShowTile';

export type ShowGridProps = { shows: ShowTileShow[]; compact?: boolean; onShowClick?: (show: ShowTileShow) => void; className?: string };

export const ShowGrid = ({ shows, compact = false, onShowClick, className }: ShowGridProps) => (
  <div className={className} {...pyxisPart('show-grid')} style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: compact ? '24px' : '32px 24px', width: '100%' }}>
    {shows.map((show, index) => (
      <ShowTile key={`${show.artist}-${show.date}-${index}`} show={show} compact={compact} onClick={onShowClick ? () => onShowClick(show) : undefined} />
    ))}
  </div>
);
