import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel, ShowsTable } from './Panels';
import './ShowsSections.css';

export function ShowsFilterBar({ confirmedCount }: { confirmedCount: number }) {
  const filters = ['All', 'Confirmed', 'Hold', 'Cancelled', 'Archived'];
  return <div className="app-shows-filter-bar" data-section="shows-filters">{filters.map((filter) => <button key={filter} data-active={filter === 'Confirmed'}>{filter}{filter === 'Confirmed' ? ` ${confirmedCount}` : ''}</button>)}<span>Sort: <strong>Date ascending</strong></span></div>;
}

export function ShowsConfirmedPanel({ shows }: { shows: AppShow[] }) {
  return <Panel title={`Confirmed · ${shows.length}`} action={<span className="app-panel-note">Pinned shows appear in #upcoming-shows</span>} section="shows-confirmed"><ShowsTable shows={shows}/></Panel>;
}

export function ShowsArchivedPanel({ shows }: { shows: AppShow[] }) {
  return <Panel title={`Archived · ${shows.length}`} action={<Button variant="ghost" size="sm">See all past shows</Button>} section="shows-archived"><ShowsTable shows={shows} variant="archived"/></Panel>;
}
