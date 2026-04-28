import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { Panel, ShowsTable } from '../../Panels';
import './ShowsArchivedPanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type ShowsArchivedPanelProps = {
  shows: AppShow[];
  onViewArchive?: () => void;
};

export function ShowsArchivedPanel({ shows, onViewArchive }: ShowsArchivedPanelProps) {
  return <Panel title={`Archived · ${shows.length}`} action={<Button variant="ghost" size="sm" onClick={onViewArchive} disabled={!onViewArchive}>See all past shows</Button>} section="shows-archived">{shows.length > 0 ? <ShowsTable shows={shows} variant="archived"/> : <AppEmptyState title="No archived shows yet." />}</Panel>;
}
