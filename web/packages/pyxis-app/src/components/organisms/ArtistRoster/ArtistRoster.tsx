import type { ArtistProfile } from 'pyxis-types';
import { ArtistCard, ArtistRosterRow } from '../../molecules/ArtistCard';
import { appPart } from '../../parts';
import '../../molecules/Table/Table.css';
import './ArtistRoster.css';
import { AppEmptyState } from '../../molecules/AppEmptyState';

export type ArtistRosterProps = {
  artists: ArtistProfile[];
};

export function ArtistRoster({ artists }: ArtistRosterProps) { return <div {...appPart('artist-roster')}>{artists.length > 0 ? <><div className="app-card-list app-mobile-only">{artists.map((artist)=><ArtistCard key={artist.id} artist={artist}/>)}</div><div className="app-table-wrap app-desktop-only"><table className="app-table"><thead><tr><th>Artist</th><th>Genre</th><th>Shows</th><th>Avg draw</th><th>Last show</th><th>Notes</th></tr></thead><tbody>{artists.map((artist)=><ArtistRosterRow key={artist.id} artist={artist}/>)}</tbody></table></div></> : <AppEmptyState title="No artists in the roster yet." />}</div>; }
