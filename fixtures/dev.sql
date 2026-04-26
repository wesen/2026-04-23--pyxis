INSERT INTO shows (artist, date, doors_time, start_time, age, price, genre, description, status, created_at, updated_at)
VALUES
  ('Burial Hex', '2026-05-02', '8:00 PM', '9:00 PM', '21+', '$12 adv / $15 door', 'Darkwave', 'An evening of dark electronics and noise.', 'confirmed', NOW(), NOW()),
  ('Moor Mother', '2026-05-09', '7:00 PM', '8:00 PM', 'All Ages', '$15', 'Experimental', 'Live electronics and spoken word.', 'confirmed', NOW(), NOW()),
  ('Cygnus + Guests', '2026-05-17', '9:00 PM', '10:00 PM', '18+', '$8', 'Techno', 'Chicago techno in the basement.', 'confirmed', NOW(), NOW()),
  ('Open Mic Night', '2026-05-23', '7:00 PM', NULL, 'All Ages', 'Free', 'Various', 'Weekly open mic — all performers welcome.', 'confirmed', NOW(), NOW()),
  ('Planning for Burial', '2025-03-14', '8:00 PM', '9:00 PM', '18+', '$10', 'Ambient', 'Intimate ambient guitar set.', 'archived', NOW(), NOW()),
  ('Actress', '2025-02-28', '9:00 PM', '10:00 PM', '21+', '$12', 'Electronic', 'UK electronic legend.', 'archived', NOW(), NOW());

INSERT INTO show_lineup (show_id, artist, role, start_time, end_time, sort_order)
VALUES
  (1, 'Burial Hex', 'headline', '9:00 PM', '11:00 PM', 0),
  (1, 'Support Act', 'support', '8:30 PM', '9:00 PM', 1),
  (3, 'Cygnus', 'headline', '10:00 PM', '12:00 AM', 0);

INSERT INTO attendance_logs (show_id, draw, notes, created_at, updated_at)
VALUES
  (5, 34, 'Good energy, small crowd.', NOW(), NOW()),
  (6, 61, 'Great turnout for a weeknight.', NOW(), NOW());
