import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel, ShowsTable } from '../Panels';
import './ShowsArchivedPanel.css';

export function ShowsArchivedPanel({ shows }: { shows: AppShow[] }) {
  return <Panel title={`Archived · ${shows.length}`} action={<Button variant="ghost" size="sm">See all past shows</Button>} section="shows-archived"><ShowsTable shows={shows} variant="archived"/></Panel>;
}
