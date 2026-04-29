-- name: ListUpcomingShows :many
SELECT id, artist, date, doors_time, start_time, age, price, genre,
       description, notes, status, flyer_url, discord_message_id, discord_channel_id, draw, capacity,
       submission_id, artist_id, created_at, updated_at
FROM shows
WHERE status = 'confirmed' AND date >= CURRENT_DATE
ORDER BY date ASC;

-- name: GetShow :one
SELECT * FROM shows WHERE id = $1;

-- name: GetShowWithLineup :one
SELECT
    s.*,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'artist', sl.artist,
                'role', sl.role,
                'startTime', sl.start_time,
                'endTime', sl.end_time
            ) ORDER BY sl.sort_order
        ) FILTER (WHERE sl.id IS NOT NULL),
        '[]'::jsonb
    ) as lineup
FROM shows s
LEFT JOIN show_lineup sl ON sl.show_id = s.id
WHERE s.id = $1
GROUP BY s.id;

-- name: CreateShow :one
INSERT INTO shows (artist, date, doors_time, start_time, age, price,
                   genre, description, notes, status, flyer_url, discord_message_id, discord_channel_id, draw, capacity,
                   submission_id, artist_id, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
RETURNING *;

-- name: UpdateShow :one
UPDATE shows
SET artist = $2, date = $3, doors_time = $4, start_time = $5,
    age = $6, price = $7, genre = $8, description = $9, notes = $10,
    status = $11, flyer_url = $12, discord_message_id = $13, discord_channel_id = $14,
    draw = $15, capacity = $16,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteShowLineup :exec
DELETE FROM show_lineup WHERE show_id = $1;

-- name: CreateShowLineupEntry :one
INSERT INTO show_lineup (show_id, artist, role, start_time, end_time, sort_order)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: AttachDiscordMessageToShow :one
UPDATE shows AS s
SET discord_channel_id = $2, discord_message_id = $3, updated_at = NOW()
WHERE s.id = $1
RETURNING s.*;

-- name: GetShowByDiscordMessage :one
SELECT * FROM shows
WHERE discord_channel_id = $1 AND discord_message_id = $2
LIMIT 1;

-- name: ListExpiredConfirmedShows :many
SELECT * FROM shows
WHERE status = 'confirmed' AND date < $1
ORDER BY date ASC;

-- name: ArchiveShow :one
UPDATE shows AS s SET status = 'archived', updated_at = NOW() WHERE s.id = $1 RETURNING s.*;

-- name: SearchArchive :many
SELECT s.id, s.artist, s.date, s.genre, COALESCE(al.draw, 0) as draw
FROM shows s
LEFT JOIN show_logs al ON al.show_id = s.id
WHERE s.status = 'archived'
  AND ($1::text = '' OR s.artist ILIKE '%' || $1 || '%' OR s.genre ILIKE '%' || $1 || '%')
ORDER BY s.date DESC;

-- name: GetArchiveStats :one
SELECT
    COUNT(*) as total_shows,
    COALESCE(SUM(al.draw), 0) as total_attendance,
    COUNT(DISTINCT date_part('year', date)) as years_running,
    COUNT(DISTINCT artist_id) as unique_artists
FROM shows s
LEFT JOIN show_logs al ON al.show_id = s.id
WHERE s.status = 'archived';

-- name: ListAllShows :many
SELECT * FROM shows ORDER BY date DESC;
