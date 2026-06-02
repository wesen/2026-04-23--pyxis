-- Rollback: remove Google Calendar sync fields from shows table.

DROP INDEX IF EXISTS idx_shows_google_cal_event_id;
ALTER TABLE shows
    DROP COLUMN IF EXISTS google_cal_event_id,
    DROP COLUMN IF EXISTS google_cal_synced_at;
