-- name: ListArtists :many
SELECT * FROM artists ORDER BY name ASC;

-- name: GetArtist :one
SELECT * FROM artists WHERE id = $1;

-- name: GetArtistByName :one
SELECT * FROM artists WHERE name = $1;

-- name: CreateArtist :one
INSERT INTO artists (name, genre, links, notes)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateArtist :one
UPDATE artists
SET name = $2, genre = $3, links = $4, notes = $5, updated_at = NOW()
WHERE id = $1
RETURNING *;
