import type { AppShow } from 'pyxis-types';
import { Panel } from '../Panels';
import './ShowDetailInfoPanel.css';

export type ShowDetailInfoPanelProps = {
  show: AppShow;
};

export function ShowDetailInfoPanel({ show }: ShowDetailInfoPanelProps) {
  return (
    <Panel title="Details" section="show-detail-info">
      <div className="app-detail-list">
        <span>Doors <b>{show.doors}</b></span>
        <span>Price <b>{show.price}</b></span>
        <span>Expected draw <b>{show.draw} / {show.capacity}</b></span>
        <span>Genre <b>{show.genre}</b></span>
      </div>
    </Panel>
  );
}
