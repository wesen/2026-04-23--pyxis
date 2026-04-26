import type { ArtistProfile } from 'pyxis-types';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ArtistCard.css';
export function ArtistCard({ artist }: { artist: ArtistProfile }) { return <article className="app-artist-card" {...appPart('artist-card')}><div className="app-avatar">{artist.name.split(' ').map((p) => p[0]).join('').slice(0,2)}</div><div><h3>{artist.name}</h3><p>{artist.genre} · {artist.shows} shows · avg {artist.avgDraw ?? '—'}</p><small>{artist.links}</small></div></article>; }
export function ArtistRosterRow({ artist }: { artist: ArtistProfile }) { return <tr className="app-table-row" {...appPart('artist-roster-row')}><td><strong>{artist.name}</strong><span>{artist.links}</span></td><td>{artist.genre}</td><td>{artist.shows}</td><td>{artist.avgDraw ?? '—'}</td><td>{artist.lastShow ?? '—'}</td><td>{artist.notes}</td></tr>; }
