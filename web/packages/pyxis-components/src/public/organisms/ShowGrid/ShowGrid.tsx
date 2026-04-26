import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import { ShowTile, type ShowTileShow } from '../../molecules/ShowTile';
import './ShowGrid.css';

export type ShowGridProps = {
  shows: ShowTileShow[];
  compact?: boolean;
  onShowClick?: (show: ShowTileShow) => void;
  className?: string;
};

export const ShowGrid = ({ shows, compact = false, onShowClick, className }: ShowGridProps) => (
  <div
    className={clsx('pyxis-show-grid', className)}
    {...pyxisPart('show-grid')}
    data-compact={compact ? 'true' : undefined}
  >
    {shows.map((show, index) => (
      <ShowTile
        key={show.id || `${show.artist}-${show.date}-${index}`}
        show={show}
        compact={compact}
        onClick={onShowClick}
      />
    ))}
  </div>
);
