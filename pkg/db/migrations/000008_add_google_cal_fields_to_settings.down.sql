-- Rollback: remove Google Calendar config fields from settings table.

ALTER TABLE settings
    DROP COLUMN IF EXISTS google_cal_enabled,
    DROP COLUMN IF EXISTS google_cal_id,
    DROP COLUMN IF EXISTS external_calendars;
