-- name: CreateSubmission :one
INSERT INTO submissions (artist_name, preferred_date, genre, expected_draw, links, tech_rider, message, contact_discord, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
RETURNING *;

-- name: GetSubmission :one
SELECT * FROM submissions WHERE id = $1;

-- name: ListSubmissions :many
SELECT * FROM submissions WHERE status = COALESCE($1, status) ORDER BY created_at DESC;
