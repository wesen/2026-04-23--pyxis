import type { AuditLogEntry } from 'pyxis-types';
import { StatusDot } from '../atoms/StatusDot';
import { appPart } from '../parts';
import './ActivityFeedItem.css';
export function ActivityFeedItem({ item }: { item: AuditLogEntry }) {
  return <li className="app-activity-feed-item" {...appPart('activity-feed-item')}><StatusDot tone={item.type === 'bot' ? 'bot' : item.type === 'decline' ? 'declined' : item.type === 'approve' ? 'approved' : 'neutral'} /><div {...appPart('activity-feed-item','body')}><p>{item.action}</p><span>{item.time} · {item.user}</span></div></li>;
}
