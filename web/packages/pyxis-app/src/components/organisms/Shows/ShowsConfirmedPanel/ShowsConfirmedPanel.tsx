import type { AppShow } from 'pyxis-types';
import { Panel, ShowsTable } from '../../Panels';
import './ShowsConfirmedPanel.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type ShowsConfirmedPanelProps = {
  shows: AppShow[];
  onEditShow?: (show: AppShow) => void;
};

export function ShowsConfirmedPanel({ shows, onEditShow }: ShowsConfirmedPanelProps) {
  return <Panel title={`Confirmed · ${shows.length}`} action={<span className="app-panel-note">Pinned shows appear in #upcoming-shows</span>} section="shows-confirmed">{shows.length > 0 ? <ShowsTable shows={shows} onEditShow={onEditShow}/> : <AppEmptyState title="No confirmed shows yet." />}</Panel>;
}
