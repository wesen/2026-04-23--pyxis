package domain

import "time"

// AttendanceLog records post-show metrics for a single show.
type AttendanceLog struct {
	ID            int
	ShowID        int
	Artist        string
	Date          time.Time
	Draw          *int
	Notes         string
	Incident      bool
	IncidentNotes string
	LoggedBy      *int
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
