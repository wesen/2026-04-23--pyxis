import { AppShow, ShowStatus } from 'pyxis-types';
import type { StatusTone } from '../../atoms/StatusDot';
import { DateChip } from '../../atoms/DateChip';
import { StatusDot } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './TodayShowCard.css';

export type TodayShowCardProps = {
  show: AppShow;
};

export function TodayShowCard({ show }: TodayShowCardProps) { return <article className="app-today-show-card" {...appPart('today-show-card')}><DateChip date={show.date} /><div><h3>{show.artist}</h3><p>{show.genre} · doors {show.doors} · {show.age}</p><span><StatusDot tone={show.status === ShowStatus.ARCHIVED ? 'archived' : show.status.toString().toLowerCase() as StatusTone} /> {show.draw}/{show.capacity} expected · {show.price}</span></div></article>; }
