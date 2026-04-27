CREATE TABLE booking_reviews (
    submission_id INT PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    note          TEXT NOT NULL DEFAULT '',
    decision      TEXT NOT NULL DEFAULT 'none',
    updated_by    INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_booking_reviews_updated_at
    BEFORE UPDATE ON booking_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
