import type { AppShow } from 'pyxis-types';
import type { StatusTone } from '../../atoms/StatusDot';
import { Icon } from 'pyxis-components';
import { AgeBadge } from '../../atoms/AgeBadge';
import { DateChip } from '../../atoms/DateChip';
import { DrawProgress } from '../../atoms/DrawProgress';
import { StatusPill } from '../../atoms/StatusPill';
import { appPart } from '../../parts';
import '../Table/Table.css';
import './ShowTableRow.css';

export type ShowTableRowVariant = 'full' | 'dashboard' | 'archived';

export type ShowTableRowProps = {
  show: AppShow;
  variant?: ShowTableRowVariant;
};

function formatShowDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return {
    short: value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    day: value.toLocaleDateString('en-US', { weekday: 'long' }),
    full: value.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

export function ShowTableRow({ show, variant = 'full' }: ShowTableRowProps) {
  const statusLabel = show.status.charAt(0).toUpperCase() + show.status.slice(1);
  const status = <span className="app-row-status"><StatusPill tone={show.status === 'archived' ? 'archived' : show.status as StatusTone}>{statusLabel}</StatusPill></span>;
  const date = formatShowDate(show.date);

  if (variant === 'archived') {
    return <tr className="app-table-row app-show-table-row app-show-table-row-archived" {...appPart('show-table-row')}><td>{date.full}</td><td><strong>{show.artist}</strong></td><td>{show.genre}</td><td><span className="app-show-attended">{show.draw} attended</span></td><td>{status}</td></tr>;
  }

  if (variant === 'dashboard') {
    return (
      <tr className="app-table-row app-table-row-dashboard" {...appPart('show-table-row')}>
        <td><DateChip date={show.date} kicker={new Date(`${show.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' })} variant="inline" /></td>
        <td><strong>{show.artist}</strong><span>{show.genre}</span></td>
        <td>{show.doors}</td>
        <td><AgeBadge>{show.age}</AgeBadge></td>
        <td><span className="app-row-status-wrap">{status}{show.pinned && <span className="app-row-pin" aria-label="Pinned to Discord">⌖</span>}</span></td>
      </tr>
    );
  }

  return <tr className="app-table-row app-show-table-row" {...appPart('show-table-row')}><td data-cell="id"><span className="app-show-id">#{show.id}</span></td><td data-cell="date"><div className="app-show-date"><strong>{date.short}</strong><span>{date.day}</span></div></td><td data-cell="artist"><strong>{show.artist}</strong><span>{show.genre}</span></td><td data-cell="doors">{show.doors}</td><td data-cell="age"><AgeBadge>{show.age}</AgeBadge></td><td data-cell="price"><span className="app-show-price">{show.price}</span></td><td data-cell="draw"><DrawProgress value={show.draw} max={show.capacity}/></td><td data-cell="status"><span className="app-row-status-wrap">{status}{show.pinned && <Icon className="app-row-pin" name="pin" size={12} aria-label="Pinned to Discord"/>}</span></td><td data-cell="edit"><button className="app-row-edit" aria-label={`Edit ${show.artist}`}><Icon name="edit" size={14}/></button></td></tr>;
}
