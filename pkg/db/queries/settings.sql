-- name: GetSettings :one
SELECT * FROM settings WHERE id = 1;

-- name: UpdateSettings :one
UPDATE settings
SET space_name = COALESCE($1, space_name),
    tagline = COALESCE($2, tagline),
    address = COALESCE($3, address),
    capacity = COALESCE($4, capacity),
    contact_email = COALESCE($5, contact_email),
    website = COALESCE($6, website),
    discord_guild_id = COALESCE($7, discord_guild_id),
    discord_ch_upcoming = COALESCE($8, discord_ch_upcoming),
    discord_ch_announcements = COALESCE($9, discord_ch_announcements),
    discord_ch_staff = COALESCE($10, discord_ch_staff),
    discord_ch_bookings = COALESCE($11, discord_ch_bookings),
    setup_complete = COALESCE($12, setup_complete),
    updated_at = NOW()
WHERE id = 1
RETURNING *;
