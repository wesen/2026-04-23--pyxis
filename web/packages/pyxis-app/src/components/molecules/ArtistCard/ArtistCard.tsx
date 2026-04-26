import type { Artist } from 'pyxis-types';
import { Avatar } from 'pyxis-components';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ArtistCard.css';

export type ArtistCardProps = {
  artist: Artist;
};

export type ArtistRosterRowProps = {
  artist: Artist;
};

export function ArtistCard({ artist }: ArtistCardProps) { return <article className="app-artist-card" {...appPart('artist-card')}><Avatar className="app-avatar" name={artist.name} size="md"/><div><h3>{artist.name}</h3><p>{artist.genre} · {artist.links}</p><small>{artist.links}</small></div></article>; }
export function ArtistRosterRow({ artist }: ArtistRosterRowProps) { return <tr className="app-table-row" {...appPart('artist-roster-row')}><td><strong>{artist.name}</strong><span>{artist.links}</span></td><td>{artist.genre}</td><td>—</td><td>—</td><td>—</td><td>{artist.notes}</td></tr>; }
