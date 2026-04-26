package domain

import "time"

// CalendarHold is a tentative date reservation for a potential show.
type CalendarHold struct {
	ID        int
	Date      time.Time
	Label     string
	CreatedBy *int
	CreatedAt time.Time
}

// CalendarBlocked is a date that is unavailable for shows.
type CalendarBlocked struct {
	ID        int
	Date      time.Time
	Reason    string
	CreatedBy *int
	CreatedAt time.Time
}
