import './ShowsFilterBar.css';

export function ShowsFilterBar({ confirmedCount }: { confirmedCount: number }) {
  const filters = ['All', 'Confirmed', 'Hold', 'Cancelled', 'Archived'];
  return <div className="app-shows-filter-bar" data-section="shows-filters">{filters.map((filter) => <button key={filter} data-active={filter === 'Confirmed'}>{filter}{filter === 'Confirmed' ? ` ${confirmedCount}` : ''}</button>)}<span>Sort: <strong>Date ascending</strong></span></div>;
}
