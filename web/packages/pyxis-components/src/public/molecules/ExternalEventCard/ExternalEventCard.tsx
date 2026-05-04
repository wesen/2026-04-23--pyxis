import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import type { ExternalEvent } from 'pyxis-types';
import './ExternalEventCard.css';

export type ExternalEventCardProps = {
  event: ExternalEvent;
  className?: string;
};

const formatEventDate = (dateStr: string, isAllDay: boolean): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  if (isAllDay) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatTimeRange = (start: string, end: string, isAllDay: boolean): string | null => {
  if (isAllDay || !start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  if (isNaN(s.getTime())) return null;

  const timeStr = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (e && !isNaN(e.getTime())) {
    const endStr = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${timeStr} – ${endStr}`;
  }
  return timeStr;
};

export const ExternalEventCard = ({ event, className }: ExternalEventCardProps) => {
  const dateLabel = formatEventDate(event.start, event.isAllDay);
  const timeRange = formatTimeRange(event.start, event.end, event.isAllDay);

  return (
    <article
      className={clsx('pyxis-external-event-card', className)}
      {...pyxisPart('external-event-card')}
      data-calendar={event.calendarName || undefined}
    >
      <div className="pyxis-external-event-card__date" aria-label={dateLabel}>
        <span className="pyxis-external-event-card__date-text">{dateLabel}</span>
        {timeRange && <span className="pyxis-external-event-card__time">{timeRange}</span>}
      </div>
      <div className="pyxis-external-event-card__info">
        <h3 className="pyxis-external-event-card__summary">{event.summary}</h3>
        {event.location && (
          <p className="pyxis-external-event-card__location">{event.location}</p>
        )}
      </div>
      <div className="pyxis-external-event-card__meta">
        {event.calendarName && (
          <span className="pyxis-external-event-card__calendar-badge">
            {event.calendarName}
          </span>
        )}
        {event.url && (
          <a
            className="pyxis-external-event-card__link"
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${event.summary} on Google Calendar`}
          >
            →
          </a>
        )}
      </div>
    </article>
  );
};
