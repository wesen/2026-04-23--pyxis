import type { AppShow } from 'pyxis-types';
import { DateChip } from '../../atoms/DateChip';
import { StatusDot } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './TodayShowCard.css';

export type TodayShowCardProps = {
  show: AppShow;
};

export function TodayShowCard({ show }: TodayShowCardProps) { return <article className="app-today-show-card" {...appPart('today-show-card')}><DateChip date={show.date} /><div><h3>{show.artist}</h3><p>{show.genre} · doors {show.doors} · {show.age}</p><span><StatusDot tone={show.status === 'archived' ? 'archived' : show.status} /> {show.draw}/{show.capacity} expected · {show.price}</span></div></article>; }
