import type { CalendarEvent } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { shows as seedShows } from '../../../api/mockData';
import { StatusPill } from '../../atoms/StatusPill';
import { Panel } from '../Panels';
import './CalendarAgenda.css';

export function CalendarAgenda({ events: _events }: { events: CalendarEvent[] }) {
  const todayShow = seedShows[0];
  return (
    <aside className="app-calendar-side" data-section="calendar-agenda">
      <Panel title="May at a glance">
        <div className="app-calendar-glance-list">
          {[["Confirmed","5","confirmed"], ["Hold","1","hold"], ["Blocked","1","blocked"], ["Open nights","24","open"]].map(([label, value, status]) => <span key={label} data-status={status}>{label}<b>{value}</b></span>)}
        </div>
      </Panel>
      <Panel title="Today · May 2">
        <div className="app-calendar-today-card">
          <header><strong>{todayShow.artist}</strong><StatusPill tone="confirmed">Confirmed</StatusPill></header>
          <p>Doors {todayShow.doors} · {todayShow.age} · $12 adv<br/>Expected draw: ~{todayShow.draw} / {todayShow.capacity}</p>
          <Button size="sm" fullWidth>Open show</Button>
        </div>
        <Button variant="outline" iconLeft="plus" fullWidth>Add to today</Button>
      </Panel>
    </aside>
  );
}
