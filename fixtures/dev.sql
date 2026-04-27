-- Deterministic local development fixture for Pyxis.
-- This file is intentionally destructive and should only be used against local/dev databases.

TRUNCATE TABLE
  sessions,
  audit_log,
  attendance_logs,
  show_lineup,
  calendar_holds,
  calendar_blocked,
  submissions,
  shows,
  artists,
  users,
  settings
RESTART IDENTITY CASCADE;

INSERT INTO settings (
  id,
  space_name,
  tagline,
  address,
  capacity,
  contact_email,
  website,
  setup_complete,
  timezone,
  booking_email,
  auto_archive,
  discord_posting,
  safe_space_required,
  updated_at
)
VALUES (
  1,
  'Pyxis',
  'A room where the weird shows happen.',
  '319 N 11th St, Philadelphia, PA',
  150,
  'booking@pyxis.test',
  'https://pyxis.test',
  TRUE,
  'America/New_York',
  'booking@pyxis.test',
  TRUE,
  TRUE,
  TRUE,
  NOW()
);

INSERT INTO users (id, discord_id, discord_username, role, created_at, last_login_at)
VALUES
  (1, 'dev:jamie', 'jamie', 'admin', NOW(), NOW()),
  (2, 'dev:sam', 'sam', 'booker', NOW(), NOW()),
  (3, 'dev:door', 'door', 'door', NOW(), NOW()),
  (4, 'dev:dev-admin', 'dev-admin', 'admin', NOW(), NOW());

INSERT INTO artists (id, name, genre, links, notes, created_at, updated_at)
VALUES
  (1, 'Burial Hex', 'Darkwave', 'https://burialhex.example', 'Great draw, always professional. Prefers no opener.', NOW(), NOW()),
  (2, 'Moor Mother', 'Experimental', 'https://moormother.example', 'Powerful spoken word and electronics.', NOW(), NOW()),
  (3, 'Cygnus', 'Techno', 'https://cygnus.example', 'Late-night techno works well.', NOW(), NOW()),
  (4, 'Open Mic Collective', 'Various', '', 'Weekly community night.', NOW(), NOW()),
  (5, 'Planning for Burial', 'Ambient', 'https://planningforburial.example', 'Headliner material.', NOW(), NOW()),
  (6, 'Actress', 'Electronic', 'https://actress.example', 'Strong archived draw.', NOW(), NOW()),
  (7, 'Pharmakon', 'Industrial', 'https://pharmakon.example', 'Pending booking.', NOW(), NOW()),
  (8, 'Lust for Youth', 'Darkwave', 'https://lustforyouth.example', 'Pending booking.', NOW(), NOW()),
  (9, 'Container', 'Noise', 'https://container.example', 'Very loud — warn neighbours.', NOW(), NOW()),
  (10, 'Orphx', 'EBM', 'https://orphx.example', 'Approved booking.', NOW(), NOW()),
  (11, 'Arca', 'Experimental', 'https://arca.example', 'Declined due to capacity mismatch.', NOW(), NOW());

INSERT INTO submissions (
  id,
  artist_id,
  artist_name,
  preferred_date,
  genre,
  expected_draw,
  links,
  tech_rider,
  message,
  contact_discord,
  status,
  reviewed_by,
  reviewed_at,
  created_at
)
VALUES
  (1, 7, 'Pharmakon', '2026-06-14', 'Industrial', 80, 'pharmakon.example', 'DI + vocal mic', 'Touring in June, looking for a basement date.', '@pharmakon', 'pending', NULL, NULL, NOW() - INTERVAL '7 days'),
  (2, 8, 'Lust for Youth', '2026-06-21', 'Darkwave', 120, 'lustforyouth.example', 'Stereo backing tracks', 'Can route through Philly on the 21st.', '@lustyouth', 'pending', NULL, NULL, NOW() - INTERVAL '6 days'),
  (3, 10, 'Orphx', '2026-07-04', 'EBM', 60, 'orphx.example', 'Table + two DI', 'Holiday weekend date request.', '@orphx', 'approved', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 days'),
  (4, 11, 'Arca', '2026-07-12', 'Experimental', 200, 'arca.example', 'Large production', 'Seeking intimate underplay.', '@arca', 'declined', 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '11 days'),
  (5, 9, 'Container', '2026-07-19', 'Noise', 55, 'container.example', 'Very loud PA', 'Looking for a noise night.', '@container', 'pending', NULL, NULL, NOW() - INTERVAL '4 days');

INSERT INTO shows (
  id,
  artist,
  date,
  doors_time,
  start_time,
  age,
  price,
  genre,
  description,
  notes,
  status,
  draw,
  capacity,
  submission_id,
  artist_id,
  created_by,
  created_at,
  updated_at
)
VALUES
  (1, 'Burial Hex', '2026-05-02', '8:00 PM', '9:00 PM', '21+', '$12 adv / $15 door', 'Darkwave', 'An evening of dark electronics and noise.', 'Confirm projector needs.', 'confirmed', 70, 150, NULL, 1, 1, NOW(), NOW()),
  (2, 'Moor Mother', '2026-05-09', '7:00 PM', '8:00 PM', 'All Ages', '$15', 'Experimental', 'Live electronics and spoken word.', '', 'confirmed', 120, 150, NULL, 2, 1, NOW(), NOW()),
  (3, 'Cygnus + Guests', '2026-05-17', '9:00 PM', '10:00 PM', '18+', '$8', 'Techno', 'Chicago techno in the basement.', 'Late load-in.', 'confirmed', 90, 150, NULL, 3, 2, NOW(), NOW()),
  (4, 'Open Mic Night', '2026-05-23', '7:00 PM', NULL, 'All Ages', 'Free', 'Various', 'Weekly open mic — all performers welcome.', '', 'confirmed', 40, 150, NULL, 4, 2, NOW(), NOW()),
  (5, 'Planning for Burial', '2025-03-14', '8:00 PM', '9:00 PM', '18+', '$10', 'Ambient', 'Intimate ambient guitar set.', '', 'archived', 34, 150, NULL, 5, 1, NOW(), NOW()),
  (6, 'Actress', '2025-02-28', '9:00 PM', '10:00 PM', '21+', '$12', 'Electronic', 'UK electronic legend.', '', 'archived', 61, 150, NULL, 6, 1, NOW(), NOW()),
  (7, 'Orphx', '2026-07-04', '9:00 PM', '10:00 PM', '21+', '$12', 'EBM', 'Approved booking from the request inbox.', 'Generated from approved submission.', 'confirmed', 60, 150, 3, 10, 1, NOW(), NOW());

INSERT INTO show_lineup (show_id, artist, role, start_time, end_time, sort_order)
VALUES
  (1, 'Burial Hex', 'headline', '9:00 PM', '11:00 PM', 0),
  (1, 'Support Act', 'support', '8:30 PM', '9:00 PM', 1),
  (2, 'Moor Mother', 'headline', '8:00 PM', '10:00 PM', 0),
  (3, 'Cygnus', 'headline', '10:00 PM', '12:00 AM', 0),
  (7, 'Orphx', 'headline', '10:00 PM', '12:00 AM', 0);

INSERT INTO calendar_holds (id, date, label, created_by, created_at)
VALUES
  (1, '2026-06-01', 'Hold — TBD', 1, NOW()),
  (2, '2026-06-14', 'Pharmakon request', 2, NOW());

INSERT INTO calendar_blocked (id, date, reason, created_by, created_at)
VALUES
  (1, '2026-05-26', 'Closed', 1, NOW()),
  (2, '2026-10-15', 'Venue maintenance', 1, NOW());

INSERT INTO attendance_logs (show_id, draw, notes, incident, incident_notes, logged_by, created_at, updated_at)
VALUES
  (5, 34, 'Good energy, small crowd.', FALSE, '', 3, NOW(), NOW()),
  (6, 61, 'Great turnout for a weeknight.', FALSE, '', 3, NOW(), NOW());

INSERT INTO audit_log (actor, actor_id, action, entity_type, entity_id, metadata, created_at)
VALUES
  ('jamie', 1, 'approved show #7 · Orphx · Jul 4', 'show', 7, '{}'::jsonb, NOW() - INTERVAL '1 day'),
  ('bot', NULL, 'posted + pinned #7 in #upcoming-shows', 'show', 7, '{}'::jsonb, NOW() - INTERVAL '1 day'),
  ('sam', 2, 'declined submission · Arca · Jul 12', 'submission', 4, '{}'::jsonb, NOW() - INTERVAL '2 days'),
  ('bot', NULL, 'auto-archived 2 past shows', 'show', 0, '{}'::jsonb, NOW() - INTERVAL '3 days'),
  ('jamie', 1, 'edited show #1 · updated doors to 8:00 PM', 'show', 1, '{}'::jsonb, NOW() - INTERVAL '4 days');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('artists_id_seq', (SELECT MAX(id) FROM artists));
SELECT setval('submissions_id_seq', (SELECT MAX(id) FROM submissions));
SELECT setval('shows_id_seq', (SELECT MAX(id) FROM shows));
SELECT setval('show_lineup_id_seq', (SELECT MAX(id) FROM show_lineup));
SELECT setval('calendar_holds_id_seq', (SELECT MAX(id) FROM calendar_holds));
SELECT setval('calendar_blocked_id_seq', (SELECT MAX(id) FROM calendar_blocked));
SELECT setval('attendance_logs_id_seq', (SELECT MAX(id) FROM attendance_logs));
SELECT setval('audit_log_id_seq', (SELECT MAX(id) FROM audit_log));
