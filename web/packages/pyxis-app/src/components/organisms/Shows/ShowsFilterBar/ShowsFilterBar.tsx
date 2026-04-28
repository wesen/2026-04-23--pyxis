import { ShowStatus } from 'pyxis-types';
import './ShowsFilterBar.css';

export type ShowsFilterValue = 'all' | ShowStatus.CONFIRMED | ShowStatus.HOLD | ShowStatus.CANCELLED | ShowStatus.ARCHIVED;

export type ShowsFilterBarProps = {
  counts: Record<ShowsFilterValue, number>;
  activeFilter: ShowsFilterValue;
  onFilterChange: (filter: ShowsFilterValue) => void;
};

const filters: Array<{ label: string; value: ShowsFilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: ShowStatus.CONFIRMED },
  { label: 'Hold', value: ShowStatus.HOLD },
  { label: 'Cancelled', value: ShowStatus.CANCELLED },
  { label: 'Archived', value: ShowStatus.ARCHIVED },
];

export function ShowsFilterBar({ counts, activeFilter, onFilterChange }: ShowsFilterBarProps) {
  return (
    <div className="app-shows-filter-bar" data-section="shows-filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          data-active={filter.value === activeFilter}
          aria-pressed={filter.value === activeFilter}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}{counts[filter.value] ? ` ${counts[filter.value]}` : ''}
        </button>
      ))}
      <span>Sort: <strong>Date ascending</strong></span>
    </div>
  );
}
