import { Button } from 'pyxis-components';
import { ShowStatus, type Show } from 'pyxis-types';
import { StatusPill } from '../../../atoms/StatusPill';
import { appPart } from '../../../parts';
import { ShowFlyerCard } from '../ShowFlyerCard';
import './ShowEditRail.css';

export type ShowEditRailProps = {
  show: Show;
  flyerUrl?: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  onUploadFlyer?: (file: File) => void;
  onDeleteFlyer?: () => void;
  onAnnounce?: () => void;
  onOpenPost?: () => void;
};

export function ShowEditRail({ show, flyerUrl, isUploading, isDeleting, onUploadFlyer, onDeleteFlyer, onAnnounce, onOpenPost }: ShowEditRailProps) {
  const isPosted = Boolean(show.discordChannelId && show.discordMessageId);
  return (
    <aside className="app-show-edit-rail" {...appPart('show-edit-rail')}>
      <ShowFlyerCard flyerUrl={flyerUrl} isUploading={isUploading} isDeleting={isDeleting} onUpload={onUploadFlyer} onDelete={onDeleteFlyer} />
      <section className="app-show-status-card" {...appPart('show-status-card')}>
        <h2>Show status</h2>
        <div className="app-show-status-card__row"><span>Status</span><StatusPill status={show.status} /></div>
        <p>{show.status === ShowStatus.CONFIRMED ? 'Confirmed shows appear on the website when a flyer is attached.' : 'Drafts and holds stay staff-only until they are confirmed.'}</p>
        {!flyerUrl && <p className="app-show-status-card__warning">Needs flyer before it can be public.</p>}
      </section>
      <section className="app-show-discord-card" {...appPart('show-discord-card')}>
        <h2>Discord</h2>
        <div className="app-show-status-card__row"><span>Channel</span><b>{show.discordChannelId ? `#${show.discordChannelId}` : '#upcoming-shows'}</b></div>
        <div className="app-show-discord-card__actions">
          <Button type="button" variant="outline" size="sm" onClick={onAnnounce}>Announce</Button>
          <Button type="button" variant="outline" size="sm" iconLeft="external" onClick={onOpenPost} disabled={!isPosted}>Open post</Button>
        </div>
        <p>{isPosted ? 'Discord post is linked for this show.' : 'Link or create a post to announce this show.'}</p>
      </section>
    </aside>
  );
}
