-- name: GetBookingReview :one
SELECT * FROM booking_reviews WHERE submission_id = $1;

-- name: UpsertBookingReview :one
INSERT INTO booking_reviews (submission_id, note, decision, updated_by)
VALUES ($1, $2, $3, $4)
ON CONFLICT (submission_id) DO UPDATE
SET note = EXCLUDED.note,
    decision = EXCLUDED.decision,
    updated_by = EXCLUDED.updated_by,
    updated_at = NOW()
RETURNING *;
