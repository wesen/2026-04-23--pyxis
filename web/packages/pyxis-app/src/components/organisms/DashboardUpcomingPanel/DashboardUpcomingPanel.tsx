import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { TodayShowCard } from '../../molecules/TodayShowCard';
import { Panel } from '../Panel';
import { ShowsTable } from '../ShowsTable';
import './DashboardUpcomingPanel.css';

export type DashboardUpcomingPanelProps = {
  shows: AppShow[];
  onViewAll?: () => void;
};

export function DashboardUpcomingPanel({ shows, onViewAll }: DashboardUpcomingPanelProps) {
  const visible = shows.slice(0, 5);
  return <Panel title="Upcoming shows" kicker="Pinned to #upcoming-shows" action={<Button variant="outline" size="sm" onClick={onViewAll}>View all ›</Button>} section="dashboard-upcoming"><div className="app-desktop-only"><ShowsTable shows={visible} variant="dashboard"/></div><div className="app-stack app-mobile-only">{shows.slice(0,3).map((show) => <TodayShowCard key={show.id} show={show}/>)}</div>{shows.length === 0 && <p className="app-empty-state">No confirmed shows yet.</p>}</Panel>;
}
