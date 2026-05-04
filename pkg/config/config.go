package config

// Config holds application configuration loaded from flags/env.
type Config struct {
	Bind                string
	DBURL               string
	AllowedOrigins      []string
	WebsiteURL          string
	SessionCookieName   string
	FlyerStoragePath    string
	FlyerBaseURL        string
	DiscordClientID     string
	DiscordClientSecret string
	DiscordRedirectURL  string
	DiscordBotToken     string
	DiscordGuildID      string
	DiscordBotEnabled   bool
	DiscordBotScript    string
	DiscordSyncOnStart  bool
	DiscordDebug        bool
	DiscordAdminRoleID  string
	DiscordBookerRoleID string
	DiscordDoorRoleID   string

	// Google Calendar integration
	GoogleCalEnabled         bool
	GoogleCalID              string
	GoogleCalCredentials     string // JSON string of service account credentials
	GoogleCalCredentialsFile string // OR path to JSON file
	GoogleCalExternal        string // JSON array of external calendar configs
}

// DefaultConfig returns a Config with sensible defaults for local development.
func DefaultConfig() *Config {
	return &Config{
		Bind:              "0.0.0.0:8080",
		DBURL:             "postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable",
		AllowedOrigins:    []string{"http://localhost:3000", "http://localhost:5173"},
		WebsiteURL:        "https://pyxis.yolo.scapegoat.dev",
		SessionCookieName: "session",
		FlyerStoragePath:  "./data/flyers",
		FlyerBaseURL:      "/flyers",
		DiscordBotScript:  "bot/discord/show-space/index.js",
	}
}
