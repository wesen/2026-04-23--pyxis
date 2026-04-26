import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel, ShowsTable } from '../Panels';
import './ShowsArchivedPanel.css';

export type ShowsArchivedPanelProps = {
  shows: AppShow[];
};

export function ShowsArchivedPanel({ shows }: ShowsArchivedPanelProps) {
  return <Panel title={`Archived · ${shows.length}`} action={<Button variant="ghost" size="sm">See all past shows</Button>} section="shows-archived">{shows.length > 0 ? <ShowsTable shows={shows} variant="archived"/> : <p className="app-empty-state">No archived shows yet.</p>}</Panel>;
}
