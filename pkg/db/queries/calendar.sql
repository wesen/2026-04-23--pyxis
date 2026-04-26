-- name: ListCalendarHolds :many
SELECT * FROM calendar_holds ORDER BY date ASC;

-- name: CreateCalendarHold :one
INSERT INTO calendar_holds (date, label, created_by)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteCalendarHold :exec
DELETE FROM calendar_holds WHERE id = $1;

-- name: ListCalendarBlocked :many
SELECT * FROM calendar_blocked ORDER BY date ASC;

-- name: CreateCalendarBlocked :one
INSERT INTO calendar_blocked (date, reason, created_by)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteCalendarBlocked :exec
DELETE FROM calendar_blocked WHERE id = $1;
