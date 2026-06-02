package gcal

import "time"

// ExternalEvent represents a calendar event from an external Google Calendar.
// Used for the "pull" (import) direction.
type ExternalEvent struct {
	ID           string    `json:"id"`
	CalendarID   string    `json:"calendarId"`
	CalendarName string    `json:"calendarName"`
	Summary      string    `json:"summary"`
	Description  string    `json:"description"`
	Location     string    `json:"location"`
	Start        time.Time `json:"start"`
	End          time.Time `json:"end"`
	StartDate    string    `json:"startDate"`
	EndDate      string    `json:"endDate"`
	URL          string    `json:"url"`
	IsAllDay     bool      `json:"isAllDay"`
}

// SyncResult is returned after syncing a show to Google Calendar.
type SyncResult struct {
	EventID  string    `json:"eventId"`
	SyncedAt time.Time `json:"syncedAt"`
}
