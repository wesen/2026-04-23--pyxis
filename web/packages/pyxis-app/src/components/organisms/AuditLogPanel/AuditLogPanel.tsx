import type { AuditLogEntry } from 'pyxis-types';
import { ActivityFeedItem } from '../../molecules/ActivityFeedItem';
import { appPart } from '../../parts';
import './AuditLogPanel.css';

export type AuditLogPanelProps = {
  log: AuditLogEntry[];
};

export function AuditLogPanel({ log }: AuditLogPanelProps) { return log.length > 0 ? <ul className="app-feed" {...appPart('audit-log-panel')}>{log.map((item)=><ActivityFeedItem key={item.id} item={item}/>)}</ul> : <p className="app-empty-state" {...appPart('audit-log-panel')}>No audit log entries yet.</p>; }
