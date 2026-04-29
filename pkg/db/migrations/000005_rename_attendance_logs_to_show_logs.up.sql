ALTER TABLE attendance_logs RENAME TO show_logs;
ALTER INDEX IF EXISTS attendance_logs_show_id_key RENAME TO show_logs_show_id_key;
ALTER TRIGGER update_attendance_logs_updated_at ON show_logs RENAME TO update_show_logs_updated_at;
