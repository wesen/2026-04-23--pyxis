package domain

import "time"

// ExternalCalendarConfig represents one external calendar entry in settings.
type ExternalCalendarConfig struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Color   string `json:"color,omitempty"`
	Enabled bool   `json:"enabled"`
}

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

	// Google Calendar integration
	GoogleCalEnabled  bool
	GoogleCalID       string
	ExternalCalendars []ExternalCalendarConfig
}
