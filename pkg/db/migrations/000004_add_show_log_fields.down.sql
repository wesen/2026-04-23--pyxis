ALTER TABLE attendance_logs
  DROP COLUMN IF EXISTS total_door_cents,
  DROP COLUMN IF EXISTS quick_highlight;
