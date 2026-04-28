import type { AppShow } from 'pyxis-types';
import { Panel, ShowsTable } from '../../Panels';
import './ShowsConfirmedPanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type ShowsConfirmedPanelProps = {
  shows: AppShow[];
  title?: string;
  emptyTitle?: string;
  note?: string;
  onEditShow?: (show: AppShow) => void;
};

export function ShowsConfirmedPanel({ shows, title = `Confirmed · ${shows.length}`, emptyTitle = 'No confirmed shows yet.', note = 'Pinned shows appear in #upcoming-shows', onEditShow }: ShowsConfirmedPanelProps) {
  return <Panel title={title} action={<span className="app-panel-note">{note}</span>} section="shows-confirmed">{shows.length > 0 ? <ShowsTable shows={shows} onEditShow={onEditShow}/> : <AppEmptyState title={emptyTitle} />}</Panel>;
}
