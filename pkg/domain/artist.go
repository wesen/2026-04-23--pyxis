package domain

import "time"

// Artist is a performer or group that has played or may play at the venue.
type Artist struct {
	ID        int
	Name      string
	Genre     string
	Links     string
	Notes     string
	CreatedAt time.Time
	UpdatedAt time.Time
}
