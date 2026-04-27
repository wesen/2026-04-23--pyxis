package cmds

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/logging"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/settings"
	"github.com/go-go-golems/pyxis/pkg/config"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/discordbot"
	"github.com/go-go-golems/pyxis/pkg/server"
	"github.com/rs/zerolog/log"
	"golang.org/x/sync/errgroup"
)

type ServeCommand struct {
	*cmds.CommandDescription
}

type ServeSettings struct {
	Bind                string `glazed:"bind"`
	DBURL               string `glazed:"db-url"`
	WebsiteURL          string `glazed:"website-url"`
	SessionCookieName   string `glazed:"session-cookie-name"`
	DiscordClientID     string `glazed:"discord-client-id"`
	DiscordClientSecret string `glazed:"discord-client-secret"`
	DiscordRedirectURL  string `glazed:"discord-redirect-url"`
	DiscordBotToken     string `glazed:"discord-bot-token"`
	DiscordGuildID      string `glazed:"discord-guild-id"`
	DiscordBot          bool   `glazed:"discord-bot"`
	DiscordBotScript    string `glazed:"discord-bot-script"`
	DiscordSyncOnStart  bool   `glazed:"discord-sync-on-start"`
	DiscordDebug        bool   `glazed:"discord-debug"`
	DiscordAdminRoleID  string `glazed:"discord-admin-role-id"`
	DiscordBookerRoleID string `glazed:"discord-booker-role-id"`
	DiscordDoorRoleID   string `glazed:"discord-door-role-id"`
}

func NewServeCommand() (*ServeCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"serve",
		cmds.WithShort("Start the Pyxis HTTP server"),
		cmds.WithLong(`Start the HTTP server that serves the public API, staff API, and auth endpoints.`),
		cmds.WithFlags(
			fields.New(
				"bind",
				fields.TypeString,
				fields.WithDefault("0.0.0.0:8080"),
				fields.WithHelp("Address to bind the HTTP server"),
			),
			fields.New(
				"db-url",
				fields.TypeString,
				fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
				fields.WithHelp("PostgreSQL connection string"),
			),
			fields.New(
				"website-url",
				fields.TypeString,
				fields.WithDefault(envOr("PYXIS_WEBSITE_URL", "https://pyxis.yolo.scapegoat.dev")),
				fields.WithHelp("Canonical external website URL used for auth redirects"),
			),
			fields.New(
				"session-cookie-name",
				fields.TypeString,
				fields.WithDefault(envOr("PYXIS_SESSION_COOKIE_NAME", "session")),
				fields.WithHelp("Cookie name used for Pyxis browser sessions"),
			),
			fields.New(
				"discord-client-id",
				fields.TypeString,
				fields.WithDefault(envOr("PYXIS_DISCORD_CLIENT_ID", "")),
				fields.WithHelp("Discord OAuth2 client ID for staff login"),
			),
			fields.New(
				"discord-client-secret",
				fields.TypeString,
				fields.WithDefault(envOr("PYXIS_DISCORD_CLIENT_SECRET", "")),
				fields.WithHelp("Discord OAuth2 client secret for staff login"),
			),
			fields.New(
				"discord-redirect-url",
				fields.TypeString,
				fields.WithDefault(envOr("PYXIS_DISCORD_REDIRECT_URL", "")),
				fields.WithHelp("Discord OAuth2 callback URL; defaults to <website-url>/auth/discord/callback"),
			),
			fields.New(
				"discord-bot-token",
				fields.TypeString,
				fields.WithDefault(envOr("DISCORD_BOT_TOKEN", "")),
				fields.WithHelp("Discord bot token used to read guild member roles during OAuth role mapping"),
			),
			fields.New(
				"discord-guild-id",
				fields.TypeString,
				fields.WithDefault(envOr("DISCORD_GUILD_ID", "")),
				fields.WithHelp("Discord guild ID used for OAuth staff role mapping"),
			),
			fields.New(
				"discord-bot",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Start the embedded Discord show-management bot"),
			),
			fields.New(
				"discord-bot-script",
				fields.TypeString,
				fields.WithDefault("bot/discord/show-space/index.js"),
				fields.WithHelp("Path to the Discord bot JavaScript entrypoint"),
			),
			fields.New(
				"discord-sync-on-start",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Sync Discord slash commands before opening the bot gateway"),
			),
			fields.New(
				"discord-debug",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Enable debug-only Discord bot commands"),
			),
			fields.New(
				"discord-admin-role-id",
				fields.TypeString,
				fields.WithDefault(envOr("DISCORD_ADMIN_ROLE_ID", "")),
				fields.WithHelp("Discord role ID mapped to the Pyxis admin role"),
			),
			fields.New(
				"discord-booker-role-id",
				fields.TypeString,
				fields.WithDefault(envOr("DISCORD_BOOKER_ROLE_ID", "")),
				fields.WithHelp("Discord role ID mapped to the Pyxis booker role"),
			),
			fields.New(
				"discord-door-role-id",
				fields.TypeString,
				fields.WithDefault(envOr("DISCORD_DOOR_ROLE_ID", "")),
				fields.WithHelp("Discord role ID mapped to the Pyxis door role"),
			),
		),
		cmds.WithSections(glazedSection, loggingSection),
	)

	return &ServeCommand{CommandDescription: cmdDesc}, nil
}

func (c *ServeCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &ServeSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return err
	}

	database, err := db.Connect(ctx, s.DBURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer database.Close()

	cfg := config.DefaultConfig()
	cfg.Bind = s.Bind
	cfg.DBURL = s.DBURL
	cfg.WebsiteURL = strings.TrimRight(strings.TrimSpace(s.WebsiteURL), "/")
	cfg.SessionCookieName = strings.TrimSpace(s.SessionCookieName)
	cfg.DiscordClientID = strings.TrimSpace(s.DiscordClientID)
	cfg.DiscordClientSecret = strings.TrimSpace(s.DiscordClientSecret)
	cfg.DiscordRedirectURL = strings.TrimSpace(s.DiscordRedirectURL)
	if cfg.DiscordRedirectURL == "" && cfg.WebsiteURL != "" && (cfg.DiscordClientID != "" || cfg.DiscordClientSecret != "") {
		cfg.DiscordRedirectURL = cfg.WebsiteURL + "/auth/discord/callback"
	}
	cfg.DiscordBotToken = strings.TrimSpace(s.DiscordBotToken)
	cfg.DiscordGuildID = strings.TrimSpace(s.DiscordGuildID)
	cfg.DiscordBotEnabled = s.DiscordBot
	cfg.DiscordBotScript = s.DiscordBotScript
	cfg.DiscordSyncOnStart = s.DiscordSyncOnStart
	cfg.DiscordDebug = s.DiscordDebug
	cfg.DiscordAdminRoleID = strings.TrimSpace(s.DiscordAdminRoleID)
	cfg.DiscordBookerRoleID = strings.TrimSpace(s.DiscordBookerRoleID)
	cfg.DiscordDoorRoleID = strings.TrimSpace(s.DiscordDoorRoleID)
	if err := validateDiscordOAuthConfig(cfg); err != nil {
		return err
	}

	srv := server.New(cfg, database)
	if !s.DiscordBot {
		log.Info().Str("bind", s.Bind).Msg("starting pyxis server without embedded Discord bot")
		return srv.Start(ctx, s.Bind)
	}

	botDeps := discordbot.NewDeps(database)
	runtimeConfig := map[string]any{
		"debug":        s.DiscordDebug,
		"adminRoleId":  s.DiscordAdminRoleID,
		"bookerRoleId": s.DiscordBookerRoleID,
		"doorRoleId":   s.DiscordDoorRoleID,
	}
	if botDeps.Settings != nil {
		if appSettings, err := botDeps.Settings.Get(ctx); err == nil && appSettings != nil {
			runtimeConfig["upcomingShowsChannelId"] = appSettings.DiscordChUpcoming
			runtimeConfig["announcementsChannelId"] = appSettings.DiscordChAnnouncements
			runtimeConfig["staffChannelId"] = appSettings.DiscordChStaff
			runtimeConfig["bookingsChannelId"] = appSettings.DiscordChBookings
			runtimeConfig["timeZone"] = appSettings.Timezone
		}
	}
	botRunner, err := discordbot.NewRunner(ctx, discordbot.Config{
		Enabled:       true,
		ScriptPath:    s.DiscordBotScript,
		SyncOnStart:   s.DiscordSyncOnStart,
		Debug:         s.DiscordDebug,
		AdminRoleID:   s.DiscordAdminRoleID,
		BookerRoleID:  s.DiscordBookerRoleID,
		RuntimeConfig: runtimeConfig,
	}, botDeps)
	if err != nil {
		return err
	}

	g, runCtx := errgroup.WithContext(ctx)
	g.Go(func() error {
		log.Info().Str("bind", s.Bind).Msg("starting pyxis HTTP server")
		return srv.Start(runCtx, s.Bind)
	})
	g.Go(func() error {
		return botRunner.Run(runCtx)
	})
	return g.Wait()
}

func envOr(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func validateDiscordOAuthConfig(cfg *config.Config) error {
	if cfg == nil {
		return fmt.Errorf("config is nil")
	}
	if cfg.WebsiteURL != "" {
		parsed, err := url.Parse(cfg.WebsiteURL)
		if err != nil || parsed.Scheme == "" || parsed.Host == "" {
			return fmt.Errorf("website-url must be an absolute URL")
		}
	}

	provided := cfg.DiscordClientID != "" || cfg.DiscordClientSecret != "" || cfg.DiscordRedirectURL != ""
	if !provided {
		return nil
	}
	if cfg.DiscordClientID == "" {
		return fmt.Errorf("discord-client-id is required when Discord OAuth is configured")
	}
	if cfg.DiscordClientSecret == "" {
		return fmt.Errorf("discord-client-secret is required when Discord OAuth is configured")
	}
	if cfg.DiscordRedirectURL == "" {
		return fmt.Errorf("discord-redirect-url is required when Discord OAuth is configured")
	}
	parsed, err := url.Parse(cfg.DiscordRedirectURL)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		return fmt.Errorf("discord-redirect-url must be an absolute URL")
	}
	return nil
}
