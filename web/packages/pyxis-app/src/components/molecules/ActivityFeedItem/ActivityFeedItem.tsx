import type { AuditLogEntry } from 'pyxis-types';
import { StatusDot } from '../../atoms/StatusDot';
import { appPart } from '../../parts';
import './ActivityFeedItem.css';

export type ActivityFeedItemVariant = 'stacked' | 'timeline';

export type ActivityFeedItemProps = {
  item: AuditLogEntry;
  variant?: ActivityFeedItemVariant;
};

function toneForAction(action: string) {
  return action.includes('decline') ? 'declined' : action.includes('approve') || action.includes('add') ? 'approved' : action.includes('bot') ? 'bot' : 'neutral';
}

export function ActivityFeedItem({ item, variant = 'stacked' }: ActivityFeedItemProps) {
  if (variant === 'timeline') {
    return (
      <li className="app-activity-feed-item app-activity-feed-item-timeline" {...appPart('activity-feed-item')}>
        <StatusDot tone={toneForAction(item.action)} />
        <span className="app-activity-time">{item.createdAt}</span>
        <p><strong>{item.actor}</strong> {item.action}</p>
      </li>
    );
  }

  return <li className="app-activity-feed-item" {...appPart('activity-feed-item')}><StatusDot tone={toneForAction(item.action)} /><div {...appPart('activity-feed-item','body')}><p>{item.action}</p><span>{item.createdAt} · {item.actor}</span></div></li>;
}
