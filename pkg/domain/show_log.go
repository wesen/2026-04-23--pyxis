package domain

import "time"

// ShowLog records post-show metrics for a single show.
type ShowLog struct {
	ID             int
	ShowID         int
	Artist         string
	Date           time.Time
	Draw           *int
	Notes          string
	QuickHighlight string
	TotalDoorCents *int
	Incident       bool
	IncidentNotes  string
	LoggedBy       *int
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
