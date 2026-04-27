import { ShowStatus } from 'pyxis-types';
import type { AppShow, CalendarEvent } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { shows as seedShows } from '../../../../api/mockData';
import { StatusPill } from '../../../atoms/StatusPill';
import { Panel } from '../../Panels';
import './CalendarAgenda.css';

export type CalendarAgendaProps = {
  events: CalendarEvent[];
  todayShow?: AppShow;
  onOpenShow?: (show: AppShow) => void;
  onAddToday?: () => void;
};

function countStatus(events: CalendarEvent[], status: CalendarEvent['status']) {
  return events.filter((event) => event.status === status).length;
}

export function CalendarAgenda({ events, todayShow = seedShows[0], onOpenShow, onAddToday }: CalendarAgendaProps) {
  const confirmedCount = countStatus(events, ShowStatus.CONFIRMED);
  const holdCount = countStatus(events, ShowStatus.HOLD);
  const blockedCount = countStatus(events, ShowStatus.BLOCKED);
  const openNights = Math.max(0, 31 - events.length);

  return (
    <aside className="app-calendar-side" data-section="calendar-agenda">
      <Panel title="May at a glance">
        <div className="app-calendar-glance-list">
          {[["Confirmed",String(confirmedCount),"confirmed"], ["Hold",String(holdCount),"hold"], ["Blocked",String(blockedCount),"blocked"], ["Open nights",String(openNights),"open"]].map(([label, value, status]) => <span key={label} data-status={status}>{label}<b>{value}</b></span>)}
        </div>
      </Panel>
      <Panel title="Today · May 2">
        <div className="app-calendar-today-card">
          <header><strong>{todayShow.artist}</strong><StatusPill tone="confirmed">Confirmed</StatusPill></header>
          <p>Doors {todayShow.doors} · {todayShow.age} · $12 adv<br/>Expected draw: ~{todayShow.draw} / {todayShow.capacity}</p>
          <Button size="sm" fullWidth onClick={() => onOpenShow?.(todayShow)}>Open show</Button>
        </div>
        <Button variant="outline" iconLeft="plus" fullWidth onClick={onAddToday}>Add to today</Button>
      </Panel>
    </aside>
  );
}
