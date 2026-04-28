import type { KeyboardEvent } from 'react';
import type { Artist } from 'pyxis-types';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ArtistRosterRow.css';

export type ArtistRosterRowProps = {
  artist: Artist;
  selected?: boolean;
  onSelect?: () => void;
};

export function ArtistRosterRow({ artist, selected, onSelect }: ArtistRosterRowProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!onSelect) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <tr
      aria-label={`Select ${artist.name}`}
      aria-pressed={selected}
      className={`app-table-row app-artist-roster-row ${selected ? 'is-selected' : ''}`}
      {...appPart('artist-roster-row')}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <td><strong>{artist.name}</strong><span>{artist.links || 'No link yet'}</span></td>
      <td>{artist.genre || '—'}</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td>{artist.notes || '—'}</td>
    </tr>
  );
}
