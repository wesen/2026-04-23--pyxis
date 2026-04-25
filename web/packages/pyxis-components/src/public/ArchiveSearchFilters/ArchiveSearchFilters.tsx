import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './ArchiveSearchFilters.css';

export type ArchiveSearchFiltersProps = {
  years?: string[];
  active?: string;
  className?: string;
};

export const ArchiveSearchFilters = ({
  years = ['All', '2025', '2024', '2023'],
  active = 'All',
  className,
}: ArchiveSearchFiltersProps) => (
  <div
    {...pyxisPart('archive-search-filters')}
    className={clsx('pyxis-archive-search-filters', className)}
  >
    <input
      className="pyxis-archive-search-filters__input"
      {...pyxisPart('archive-search-filters', 'input')}
      placeholder="Search artists, dates, tags…"
    />
    <div className="pyxis-archive-search-filters__years" {...pyxisPart('archive-search-filters', 'years')}>
      {years.map((year) => {
        const isActive = year === active;
        return (
          <button
            key={year}
            className="pyxis-archive-search-filters__year-button"
            {...pyxisPart('archive-search-filters', 'year-button')}
            data-state={isActive ? 'active' : undefined}
          >
            {year}
          </button>
        );
      })}
    </div>
  </div>
);
