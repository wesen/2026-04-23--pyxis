-- name: GetAttendanceLog :one
SELECT * FROM attendance_logs WHERE show_id = $1;

-- name: UpsertAttendanceLog :one
INSERT INTO attendance_logs (show_id, draw, notes, incident, incident_notes, logged_by)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (show_id) DO UPDATE SET
    draw = EXCLUDED.draw,
    notes = EXCLUDED.notes,
    incident = EXCLUDED.incident,
    incident_notes = EXCLUDED.incident_notes,
    logged_by = EXCLUDED.logged_by,
    updated_at = NOW()
RETURNING *;

-- name: ListAttendanceLogs :many
SELECT al.*, s.artist, s.date
FROM attendance_logs al
JOIN shows s ON s.id = al.show_id
ORDER BY s.date DESC
LIMIT $1 OFFSET $2;
