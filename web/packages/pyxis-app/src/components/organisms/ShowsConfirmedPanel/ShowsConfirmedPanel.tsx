import type { AppShow } from 'pyxis-types';
import { Panel, ShowsTable } from '../Panels';
import './ShowsConfirmedPanel.css';

export type ShowsConfirmedPanelProps = {
  shows: AppShow[];
};

export function ShowsConfirmedPanel({ shows }: ShowsConfirmedPanelProps) {
  return <Panel title={`Confirmed · ${shows.length}`} action={<span className="app-panel-note">Pinned shows appear in #upcoming-shows</span>} section="shows-confirmed">{shows.length > 0 ? <ShowsTable shows={shows}/> : <p className="app-empty-state">No confirmed shows yet.</p>}</Panel>;
}
