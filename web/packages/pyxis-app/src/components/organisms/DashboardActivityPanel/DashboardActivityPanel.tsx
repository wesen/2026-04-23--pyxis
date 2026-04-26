import type { AuditLogEntry } from 'pyxis-types';
import { ActivityFeedItem } from '../../molecules/ActivityFeedItem';
import { Panel } from '../Panel';
import './DashboardActivityPanel.css';
export function DashboardActivityPanel({ log, limit = 5 }: { log: AuditLogEntry[]; limit?: number }) { return <Panel title="Recent activity" action={<span className="app-live-label">live</span>} section="dashboard-activity"><ul className="app-feed app-feed-timeline">{log.slice(0,limit).map((item)=><ActivityFeedItem key={item.id} item={item} variant="timeline"/>)}</ul></Panel>; }
