import type { AttendanceEntry } from 'pyxis-types';
import { AttendanceStat } from '../../molecules/AttendanceStat';
import { appPart } from '../../parts';
import '../../molecules/BookingCard/BookingCard.css';
import '../DashboardMetricsGrid/DashboardMetricsGrid.css';
import './AttendancePanel.css';
export function AttendancePanel({ entries }: { entries: AttendanceEntry[] }) { const logged = entries.filter((e)=>e.logged); const avg = Math.round(logged.reduce((n,e)=>n+(e.draw ?? 0),0)/Math.max(logged.length,1)); return <div {...appPart('attendance-panel')}><div className="app-metrics-grid compact"><AttendanceStat label="Logged" value={logged.length}/><AttendanceStat label="Needs log" value={entries.length-logged.length}/><AttendanceStat label="Average draw" value={avg}/></div><div className="app-card-list">{entries.map((entry)=><article className="app-booking-card" key={entry.id}><h3>{entry.artist}</h3><p>{entry.date} · {entry.logged ? `${entry.draw} attendees` : 'needs report'}</p><small>{entry.notes ?? 'No notes yet.'}</small></article>)}</div></div>; }
