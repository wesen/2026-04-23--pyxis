package domain

import "time"

// Status values for shows.
const (
	StatusConfirmed = "confirmed"
	StatusCancelled = "cancelled"
	StatusArchived  = "archived"
	StatusDraft     = "draft"
	StatusHold      = "hold"
	StatusBlocked   = "blocked"
)

// Show is the domain entity for a scheduled event.
type Show struct {
	ID           int
	Artist       string
	Date         time.Time
	DoorsTime    string
	StartTime    string
	Age          string
	Price        string
	Genre        string
	Description  string
	Lineup       []LineupEntry
	FlyerURL     string
	Status       string
	SubmissionID *int
	ArtistID     *int
	CreatedBy    *int
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// LineupEntry represents one act in a show lineup.
type LineupEntry struct {
	Artist    string
	Role      string
	StartTime string
	EndTime   string
}

// ArchivedShow is a simplified view for the public archive.
type ArchivedShow struct {
	ID     int
	Artist string
	Date   time.Time
	Genre  string
	Draw   int
}

// ArchiveStats holds aggregate statistics.
type ArchiveStats struct {
	TotalShows      int
	TotalAttendance int
	YearsRunning    int
	UniqueArtists   int
}
