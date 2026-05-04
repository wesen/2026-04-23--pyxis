import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './ShowGCalSyncStatus.css';

export type ShowGCalSyncStatusProps = {
  /** Whether the show has a GCal event ID (synced). */
  synced: boolean;
  /** The Google Calendar event ID, if synced. */
  eventId?: string;
  /** When the show was last synced (ISO 8601). */
  syncedAt?: string;
  /** Whether a manual sync is in progress. */
  isSyncing?: boolean;
  /** Trigger a manual re-sync. */
  onSync?: () => void;
  /** Whether the user can trigger sync. */
  canEdit?: boolean;
};

export function ShowGCalSyncStatus({
  synced,
  eventId,
  syncedAt,
  isSyncing = false,
  onSync,
  canEdit = true,
}: ShowGCalSyncStatusProps) {
  const syncedLabel = syncedAt
    ? `Synced ${new Date(syncedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
    : synced ? 'Synced' : 'Not synced';

  return (
    <div className="app-gcal-sync-status" {...appPart('gcal-sync-status')} data-synced={synced}>
      <div className="app-gcal-sync-status__indicator">
        <span className="app-gcal-sync-status__dot" />
        <span className="app-gcal-sync-status__label">{syncedLabel}</span>
      </div>
      {eventId && (
        <span className="app-gcal-sync-status__event-id" title={eventId}>
          Event {eventId.slice(0, 8)}…
        </span>
      )}
      {canEdit && onSync && (
        <Button onClick={onSync} isLoading={isSyncing} className="app-gcal-sync-status__button">
          {synced ? 'Re-sync' : 'Sync to Google Calendar'}
        </Button>
      )}
    </div>
  );
}
