import type { Artist } from 'pyxis-types';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ArtistRosterRow.css';

export type ArtistRosterRowProps = {
  artist: Artist;
  selected?: boolean;
  onSelect?: () => void;
};

export function ArtistRosterRow({ artist, selected, onSelect }: ArtistRosterRowProps) { return <tr className={`app-table-row app-artist-roster-row ${selected ? 'is-selected' : ''}`} {...appPart('artist-roster-row')} onClick={onSelect} tabIndex={0}><td><strong>{artist.name}</strong><span>{artist.links}</span></td><td>{artist.genre}</td><td>—</td><td>—</td><td>—</td><td>{artist.notes}</td></tr>; }
