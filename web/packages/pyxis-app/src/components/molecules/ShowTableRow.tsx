import type { AppShow } from 'pyxis-types';
import { DateChip } from '../atoms/DateChip';
import { StatusDot } from '../atoms/StatusDot';
import { appPart } from '../parts';
import './Rows.css';

export function ShowTableRow({ show, variant = 'full' }: { show: AppShow; variant?: 'full' | 'dashboard' }) {
  const status = <span className="app-row-status"><StatusDot tone={show.status === 'archived' ? 'archived' : show.status} />{show.status}</span>;

  if (variant === 'dashboard') {
    return (
      <tr className="app-table-row app-table-row-dashboard" {...appPart('show-table-row')}>
        <td><DateChip date={show.date} kicker={new Date(`${show.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' })} variant="inline" /></td>
        <td><strong>{show.artist}</strong><span>{show.genre}</span></td>
        <td>{show.doors}</td>
        <td><span className="app-row-tag">{show.age}</span></td>
        <td><span className="app-row-status-wrap">{status}{show.pinned && <span className="app-row-pin" aria-label="Pinned to Discord">⌖</span>}</span></td>
      </tr>
    );
  }

  return <tr className="app-table-row" {...appPart('show-table-row')}><td><DateChip date={show.date} /></td><td><strong>{show.artist}</strong><span>{show.genre}</span></td><td>{show.doors}</td><td>{show.age}</td><td>{show.price}</td><td>{show.draw}/{show.capacity}</td><td>{status}</td></tr>;
}
