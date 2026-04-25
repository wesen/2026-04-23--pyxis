import type { AppShow } from 'pyxis-types';
import { DateChip } from '../atoms/DateChip';
import { StatusDot } from '../atoms/StatusDot';
import { appPart } from '../parts';
import './Rows.css';
export function ShowTableRow({ show }: { show: AppShow }) { return <tr className="app-table-row" {...appPart('show-table-row')}><td><DateChip date={show.date} /></td><td><strong>{show.artist}</strong><span>{show.genre}</span></td><td>{show.doors}</td><td>{show.age}</td><td>{show.price}</td><td>{show.draw}/{show.capacity}</td><td><span className="app-row-status"><StatusDot tone={show.status === 'archived' ? 'archived' : show.status} />{show.status}</span></td></tr>; }
