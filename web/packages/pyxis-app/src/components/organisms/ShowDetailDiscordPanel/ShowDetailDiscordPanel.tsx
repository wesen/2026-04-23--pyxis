import { Button } from 'pyxis-components';
import { Panel } from '../Panels';
import './ShowDetailDiscordPanel.css';

export function ShowDetailDiscordPanel() {
  return (
    <Panel title="Posted to Discord" section="show-detail-discord">
      <p className="app-muted-copy">#upcoming-shows · Pinned · 4 days ago · 12 reactions</p>
      <Button variant="outline" iconLeft="external">Open post</Button>
    </Panel>
  );
}
