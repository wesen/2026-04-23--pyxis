import type { AuditLogEntry } from 'pyxis-types';
import { ActivityFeedItem } from '../../molecules/ActivityFeedItem';
import { Panel } from '../Panel';
import './DashboardActivityPanel.css';

export type DashboardActivityPanelProps = {
  log: AuditLogEntry[];
  limit?: number;
};

export function DashboardActivityPanel({ log, limit = 5 }: DashboardActivityPanelProps) { const visible = log.slice(0,limit); return <Panel title="Recent activity" action={<span className="app-live-label">live</span>} section="dashboard-activity">{visible.length > 0 ? <ul className="app-feed app-feed-timeline">{visible.map((item)=><ActivityFeedItem key={item.id} item={item} variant="timeline"/>)}</ul> : <p className="app-empty-state">No recent activity.</p>}</Panel>; }
