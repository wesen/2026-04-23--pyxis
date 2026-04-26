import type { ArtistProfile } from 'pyxis-types';
import { Avatar } from 'pyxis-components';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ArtistCard.css';

export type ArtistCardProps = {
  artist: ArtistProfile;
};

export type ArtistRosterRowProps = {
  artist: ArtistProfile;
};

export function ArtistCard({ artist }: ArtistCardProps) { return <article className="app-artist-card" {...appPart('artist-card')}><Avatar className="app-avatar" name={artist.name} size="md"/><div><h3>{artist.name}</h3><p>{artist.genre} · {artist.shows} shows · avg {artist.avgDraw ?? '—'}</p><small>{artist.links}</small></div></article>; }
export function ArtistRosterRow({ artist }: ArtistRosterRowProps) { return <tr className="app-table-row" {...appPart('artist-roster-row')}><td><strong>{artist.name}</strong><span>{artist.links}</span></td><td>{artist.genre}</td><td>{artist.shows}</td><td>{artist.avgDraw ?? '—'}</td><td>{artist.lastShow ?? '—'}</td><td>{artist.notes}</td></tr>; }
