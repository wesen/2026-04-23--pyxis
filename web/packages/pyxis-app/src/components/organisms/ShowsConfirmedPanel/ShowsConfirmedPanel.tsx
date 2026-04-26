import type { AppShow } from 'pyxis-types';
import { Panel, ShowsTable } from '../Panels';
import './ShowsConfirmedPanel.css';

export function ShowsConfirmedPanel({ shows }: { shows: AppShow[] }) {
  return <Panel title={`Confirmed · ${shows.length}`} action={<span className="app-panel-note">Pinned shows appear in #upcoming-shows</span>} section="shows-confirmed"><ShowsTable shows={shows}/></Panel>;
}
