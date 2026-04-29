import type { AppShow } from 'pyxis-types';
import { ShowTableRow, type ShowTableRowVariant } from '../../../molecules/ShowTableRow';
import { appPart } from '../../../parts';
import '../../../molecules/Table/Table.css';
import './ShowsTable.css';

export type ShowsTableShow = AppShow & { flyerUrl?: string };

export type ShowsTableProps = {
  shows: ShowsTableShow[];
  variant?: ShowTableRowVariant;
  onEditShow?: (show: AppShow) => void;
};

export function ShowsTable({ shows, variant = 'full', onEditShow }: ShowsTableProps) {
  const dashboard = variant === 'dashboard';
  const archived = variant === 'archived';
  return <div className="app-table-wrap" {...appPart('shows-table')}><table className={`app-table${dashboard ? ' app-table-dashboard' : archived ? ' app-shows-archived-table' : ' app-shows-table'}`}><thead><tr>{dashboard ? <><th>Date</th><th>Artist</th><th>Doors</th><th>Age</th><th>Status</th></> : archived ? <><th>Date</th><th>Artist</th><th>Genre</th><th>Draw</th><th>Status</th></> : <><th>#</th><th>Date</th><th>Flyer</th><th>Artist</th><th>Doors</th><th>Age</th><th>Price</th><th>Draw</th><th>Status</th><th aria-label="Actions" /></>}</tr></thead><tbody>{shows.map((show)=><ShowTableRow key={show.id} show={show} variant={variant} onEdit={onEditShow}/>)}</tbody></table></div>;
}
