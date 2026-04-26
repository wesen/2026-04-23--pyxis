package domain

import "time"

// Submission is a booking inquiry from an artist.
type Submission struct {
	ID             int
	ArtistID       *int
	ArtistName     string
	PreferredDate  *time.Time
	Genre          string
	ExpectedDraw   *int
	Links          string
	TechRider      string
	Message        string
	ContactDiscord string
	Status         string
	ReviewedBy     *int
	ReviewedAt     *time.Time
	CreatedAt      time.Time
}
