-- name: CreateSubmission :one
INSERT INTO submissions (artist_name, preferred_date, genre, expected_draw, links, tech_rider, message, contact_discord, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
RETURNING *;

-- name: GetSubmission :one
SELECT * FROM submissions WHERE id = $1;

-- name: ListSubmissions :many
SELECT * FROM submissions WHERE ($1 = '' OR status = $1) ORDER BY created_at DESC;

-- name: ApproveSubmission :one
UPDATE submissions
SET status = 'approved', reviewed_by = $2, reviewed_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeclineSubmission :one
UPDATE submissions
SET status = 'declined', reviewed_by = $2, reviewed_at = NOW()
WHERE id = $1
RETURNING *;
