-- name: GetShowLog :one
SELECT * FROM show_logs WHERE show_id = $1;

-- name: UpsertShowLog :one
INSERT INTO show_logs (show_id, draw, notes, incident, incident_notes, logged_by, quick_highlight, total_door_cents)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (show_id) DO UPDATE SET
    draw = EXCLUDED.draw,
    notes = EXCLUDED.notes,
    incident = EXCLUDED.incident,
    incident_notes = EXCLUDED.incident_notes,
    logged_by = EXCLUDED.logged_by,
    quick_highlight = EXCLUDED.quick_highlight,
    total_door_cents = EXCLUDED.total_door_cents,
    updated_at = NOW()
RETURNING *;

-- name: ListShowLogs :many
SELECT al.*, s.artist, s.date
FROM show_logs al
JOIN shows s ON s.id = al.show_id
ORDER BY s.date DESC
LIMIT $1 OFFSET $2;
