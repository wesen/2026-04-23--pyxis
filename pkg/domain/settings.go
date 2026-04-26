package domain

import "time"

// Settings is the single-row space configuration.
type Settings struct {
	ID                     int
	SpaceName              string
	Tagline                string
	Address                string
	Capacity               *int
	Timezone               string
	ContactEmail           string
	BookingEmail           string
	Website                string
	AutoArchive            bool
	DiscordPosting         bool
	SafeSpaceRequired      bool
	DiscordGuildID         string
	DiscordChUpcoming      string
	DiscordChAnnouncements string
	DiscordChStaff         string
	DiscordChBookings      string
	SetupComplete          bool
	UpdatedAt              time.Time
}
