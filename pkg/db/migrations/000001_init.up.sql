CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    discord_id       TEXT NOT NULL UNIQUE,
    discord_username TEXT NOT NULL,
    avatar_url       TEXT,
    role             TEXT NOT NULL DEFAULT 'staff',
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    last_login_at    TIMESTAMPTZ
);

CREATE TABLE artists (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    genre      TEXT,
    links      TEXT,
    notes      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
    id              SERIAL PRIMARY KEY,
    artist_id       INT REFERENCES artists(id) ON DELETE SET NULL,
    artist_name     TEXT NOT NULL,
    preferred_date  DATE,
    genre           TEXT,
    expected_draw   INT,
    links           TEXT,
    tech_rider      TEXT,
    message         TEXT,
    contact_discord TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    reviewed_by     INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_submissions_status ON submissions(status);

CREATE TABLE shows (
    id                 SERIAL PRIMARY KEY,
    artist             TEXT NOT NULL,
    date               DATE NOT NULL,
    doors_time         TEXT,
    start_time         TEXT,
    age                TEXT,
    price              TEXT,
    genre              TEXT,
    description        TEXT,
    notes              TEXT,
    status             TEXT NOT NULL DEFAULT 'confirmed',
    flyer_url          TEXT,
    discord_message_id TEXT,
    discord_channel_id TEXT,
    submission_id      INT REFERENCES submissions(id) ON DELETE SET NULL,
    artist_id          INT REFERENCES artists(id) ON DELETE SET NULL,
    created_by         INT REFERENCES users(id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_shows_status ON shows(status);
CREATE INDEX idx_shows_date   ON shows(date);

CREATE TABLE show_lineup (
    id         SERIAL PRIMARY KEY,
    show_id    INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    artist     TEXT NOT NULL,
    role       TEXT NOT NULL,
    start_time TEXT,
    end_time   TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE calendar_holds (
    id         SERIAL PRIMARY KEY,
    date       DATE NOT NULL,
    label      TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE calendar_blocked (
    id         SERIAL PRIMARY KEY,
    date       DATE NOT NULL,
    reason     TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance_logs (
    id             SERIAL PRIMARY KEY,
    show_id        INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    draw           INT,
    notes          TEXT,
    incident       BOOLEAN DEFAULT FALSE,
    incident_notes TEXT,
    logged_by      INT REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (show_id)
);

CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    actor       TEXT NOT NULL,
    actor_id    INT REFERENCES users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,
    entity_type TEXT,
    entity_id   INT,
    metadata    JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity     ON audit_log(entity_type, entity_id);

CREATE TABLE settings (
    id                       INT PRIMARY KEY DEFAULT 1,
    space_name               TEXT NOT NULL DEFAULT 'Pyxis',
    tagline                  TEXT,
    address                  TEXT,
    capacity                 INT,
    contact_email            TEXT,
    website                  TEXT,
    discord_guild_id         TEXT,
    discord_ch_upcoming      TEXT,
    discord_ch_announcements TEXT,
    discord_ch_staff         TEXT,
    discord_ch_bookings      TEXT,
    setup_complete           BOOLEAN DEFAULT FALSE,
    updated_at               TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO settings DEFAULT VALUES;

CREATE TABLE sessions (
    id         TEXT PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shows_updated_at
    BEFORE UPDATE ON shows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_logs_updated_at
    BEFORE UPDATE ON attendance_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
