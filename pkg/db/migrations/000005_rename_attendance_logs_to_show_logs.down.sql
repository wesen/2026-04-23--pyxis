ALTER TABLE show_logs RENAME TO attendance_logs;
ALTER INDEX IF EXISTS show_logs_show_id_key RENAME TO attendance_logs_show_id_key;
ALTER TRIGGER update_show_logs_updated_at ON attendance_logs RENAME TO update_attendance_logs_updated_at;
