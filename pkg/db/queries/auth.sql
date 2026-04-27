-- name: UpsertUser :one
INSERT INTO users (discord_id, discord_username, avatar_url, role, last_login_at)
VALUES ($1, $2, $3, $4, NOW())
ON CONFLICT (discord_id) DO UPDATE SET
    discord_username = EXCLUDED.discord_username,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role,
    last_login_at = NOW()
RETURNING *;

-- name: UpsertDevUser :one
INSERT INTO users (discord_id, discord_username, avatar_url, role, last_login_at)
VALUES ($1, $2, $3, $4, NOW())
ON CONFLICT (discord_id) DO UPDATE SET
    discord_username = EXCLUDED.discord_username,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role,
    last_login_at = NOW()
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: CreateSession :one
INSERT INTO sessions (id, user_id, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetSession :one
SELECT * FROM sessions WHERE id = $1;

-- name: DeleteSession :exec
DELETE FROM sessions WHERE id = $1;
