import type { Artist } from 'pyxis-types';
import { ArtistCard, ArtistRosterRow } from '../../../molecules/ArtistCard';
import { appPart } from '../../../parts';
import '../../../molecules/Table/Table.css';
import './ArtistRoster.css';
import { AppEmptyState } from '../../../molecules/AppEmptyState';

export type ArtistRosterProps = {
  artists: Artist[];
  selectedArtistId?: number;
  onSelectArtist?: (artist: Artist) => void;
};

export function ArtistRoster({ artists, selectedArtistId, onSelectArtist }: ArtistRosterProps) {
  return (
    <div {...appPart('artist-roster')}>
      {artists.length > 0 ? <>
        <div className="app-card-list app-mobile-only">
          {artists.map((artist)=><button className="app-artist-roster-button" key={artist.id} onClick={() => onSelectArtist?.(artist)}><ArtistCard artist={artist}/></button>)}
        </div>
        <div className="app-table-wrap app-desktop-only">
          <table className="app-table"><thead><tr><th>Artist</th><th>Genre</th><th>Shows</th><th>Avg draw</th><th>Last show</th><th>Notes</th></tr></thead><tbody>{artists.map((artist)=><ArtistRosterRow key={artist.id} artist={artist} selected={artist.id === selectedArtistId} onSelect={() => onSelectArtist?.(artist)} />)}</tbody></table>
        </div>
      </> : <AppEmptyState title="No artists in the roster yet." />}
    </div>
  );
}
