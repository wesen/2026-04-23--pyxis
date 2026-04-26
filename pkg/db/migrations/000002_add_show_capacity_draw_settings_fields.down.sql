ALTER TABLE shows
    DROP COLUMN IF EXISTS draw,
    DROP COLUMN IF EXISTS capacity;

ALTER TABLE settings
    DROP COLUMN IF EXISTS timezone,
    DROP COLUMN IF EXISTS booking_email,
    DROP COLUMN IF EXISTS auto_archive,
    DROP COLUMN IF EXISTS discord_posting,
    DROP COLUMN IF EXISTS safe_space_required;
