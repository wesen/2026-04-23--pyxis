import type { Artist } from 'pyxis-types';
import { Avatar } from 'pyxis-components';
import { appPart } from '../../parts';
import './ArtistCard.css';

export type ArtistCardProps = {
  artist: Artist;
};

export function ArtistCard({ artist }: ArtistCardProps) { return <article className="app-artist-card" {...appPart('artist-card')}><Avatar className="app-avatar" name={artist.name} size="md"/><div><h3>{artist.name}</h3><p>{artist.genre} · {artist.links}</p><small>{artist.links}</small></div></article>; }
