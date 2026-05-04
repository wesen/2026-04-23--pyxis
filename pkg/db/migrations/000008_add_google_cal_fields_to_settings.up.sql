-- Migration: add Google Calendar config fields to settings table.
-- Stores venue Google Calendar ID and external calendars for import.

ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS google_cal_enabled BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS google_cal_id TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS external_calendars JSONB NOT NULL DEFAULT '[]'::jsonb;
