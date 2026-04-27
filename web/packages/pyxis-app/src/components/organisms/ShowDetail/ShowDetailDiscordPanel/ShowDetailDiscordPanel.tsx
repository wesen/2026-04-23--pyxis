import { Button } from 'pyxis-components';
import { Panel } from '../Panels';
import './ShowDetailDiscordPanel.css';

export type ShowDetailDiscordPanelProps = {
  channelLabel?: string;
  statusLabel?: string;
  reactionCount?: number;
  onOpenPost?: () => void;
};

export function ShowDetailDiscordPanel({ channelLabel = '#upcoming-shows', statusLabel = 'Pinned · 4 days ago', reactionCount = 12, onOpenPost }: ShowDetailDiscordPanelProps) {
  return (
    <Panel title="Posted to Discord" section="show-detail-discord">
      <p className="app-muted-copy">{channelLabel} · {statusLabel} · {reactionCount} reactions</p>
      <Button variant="outline" iconLeft="external" onClick={onOpenPost}>Open post</Button>
    </Panel>
  );
}
