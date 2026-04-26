import type { AuditLogEntry } from 'pyxis-types';
import { StatusDot } from '../atoms/StatusDot';
import { appPart } from '../parts';
import './ActivityFeedItem.css';

function toneForType(type: AuditLogEntry['type']) {
  return type === 'bot' ? 'bot' : type === 'decline' ? 'declined' : type === 'approve' || type === 'add' ? 'approved' : 'neutral';
}

export function ActivityFeedItem({ item, variant = 'stacked' }: { item: AuditLogEntry; variant?: 'stacked' | 'timeline' }) {
  if (variant === 'timeline') {
    return (
      <li className="app-activity-feed-item app-activity-feed-item-timeline" {...appPart('activity-feed-item')}>
        <StatusDot tone={toneForType(item.type)} />
        <span className="app-activity-time">{item.time}</span>
        <p><strong>{item.user}</strong> {item.action}</p>
      </li>
    );
  }

  return <li className="app-activity-feed-item" {...appPart('activity-feed-item')}><StatusDot tone={toneForType(item.type)} /><div {...appPart('activity-feed-item','body')}><p>{item.action}</p><span>{item.time} · {item.user}</span></div></li>;
}
