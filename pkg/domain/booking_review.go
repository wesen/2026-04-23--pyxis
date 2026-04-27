package domain

import "time"

// BookingReview stores staff-only review notes for a booking submission.
type BookingReview struct {
	SubmissionID int
	Note         string
	Decision     string
	UpdatedBy    *int
	UpdatedAt    time.Time
}
