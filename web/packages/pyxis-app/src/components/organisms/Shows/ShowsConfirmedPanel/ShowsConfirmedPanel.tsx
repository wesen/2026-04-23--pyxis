import type { AppShow } from 'pyxis-types';
import { Panel, ShowsTable, type ShowsTableShow } from '../../Panels';
import './ShowsConfirmedPanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type ShowsConfirmedPanelProps = {
  shows: AppShow[];
  title?: string;
  emptyTitle?: string;
  note?: string;
  onEditShow?: (show: AppShow) => void;
  onPreviewFlyer?: (show: ShowsTableShow) => void;
};

export function ShowsConfirmedPanel({ shows, title = `Confirmed · ${shows.length}`, emptyTitle = 'No confirmed shows yet.', note = 'Pinned shows appear in #upcoming-shows', onEditShow, onPreviewFlyer }: ShowsConfirmedPanelProps) {
  return <Panel title={title} action={<span className="app-panel-note">{note}</span>} section="shows-confirmed">{shows.length > 0 ? <ShowsTable shows={shows} onEditShow={onEditShow} onPreviewFlyer={onPreviewFlyer}/> : <AppEmptyState title={emptyTitle} />}</Panel>;
}
