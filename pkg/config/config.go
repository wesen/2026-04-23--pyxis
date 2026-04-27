package config

// Config holds application configuration loaded from flags/env.
type Config struct {
	Bind                string
	DBURL               string
	AllowedOrigins      []string
	DiscordClientID     string
	DiscordClientSecret string
	DiscordRedirectURL  string
	DiscordBotEnabled   bool
	DiscordBotScript    string
	DiscordSyncOnStart  bool
	DiscordDebug        bool
	DiscordAdminRoleID  string
	DiscordBookerRoleID string
}

// DefaultConfig returns a Config with sensible defaults for local development.
func DefaultConfig() *Config {
	return &Config{
		Bind:             "0.0.0.0:8080",
		DBURL:            "postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable",
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		DiscordBotScript: "bot/discord/show-space/index.js",
	}
}
