-- Migration: add Google Calendar sync fields to shows table.
-- Stores the Google Calendar event ID so we can update/delete events later.

ALTER TABLE shows
    ADD COLUMN IF NOT EXISTS google_cal_event_id TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS google_cal_synced_at TIMESTAMPTZ;

-- Index for looking up shows by their Google Calendar event ID
CREATE INDEX IF NOT EXISTS idx_shows_google_cal_event_id
    ON shows (google_cal_event_id)
    WHERE google_cal_event_id != '';
