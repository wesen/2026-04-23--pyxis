import type { AuditLogEntry } from 'pyxis-types';
import { ActivityFeedItem } from '../../molecules/ActivityFeedItem';
import { appPart } from '../../parts';
import './AuditLogPanel.css';
export function AuditLogPanel({ log }: { log: AuditLogEntry[] }) { return <ul className="app-feed" {...appPart('audit-log-panel')}>{log.map((item)=><ActivityFeedItem key={item.id} item={item}/>)}</ul>; }
