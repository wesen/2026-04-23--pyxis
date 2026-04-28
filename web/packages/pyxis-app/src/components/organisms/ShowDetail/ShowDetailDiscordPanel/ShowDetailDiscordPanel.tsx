import { Button } from 'pyxis-components';
import { Panel } from '../../Panels';
import './ShowDetailDiscordPanel.css';

export type ShowDetailDiscordPanelProps = {
  channelLabel?: string;
  statusLabel?: string;
  reactionCount?: number;
  isPosted?: boolean;
  onOpenPost?: () => void;
};

export function ShowDetailDiscordPanel({ channelLabel = '#upcoming-shows', statusLabel = 'Not posted yet', reactionCount = 0, isPosted = false, onOpenPost }: ShowDetailDiscordPanelProps) {
  return (
    <Panel title="Posted to Discord" section="show-detail-discord">
      <p className="app-muted-copy">{channelLabel} · {statusLabel}{isPosted ? ` · ${reactionCount} reactions` : ''}</p>
      <Button variant="outline" iconLeft="external" onClick={onOpenPost} disabled={!isPosted} title={isPosted ? 'Open the Discord message' : 'Announce this show before opening a Discord post'}>Open post</Button>
    </Panel>
  );
}
