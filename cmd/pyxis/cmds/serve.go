package cmds

import (
	"context"
	"fmt"

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
	DiscordBot          bool   `glazed:"discord-bot"`
	DiscordBotScript    string `glazed:"discord-bot-script"`
	DiscordSyncOnStart  bool   `glazed:"discord-sync-on-start"`
	DiscordDebug        bool   `glazed:"discord-debug"`
	DiscordAdminRoleID  string `glazed:"discord-admin-role-id"`
	DiscordBookerRoleID string `glazed:"discord-booker-role-id"`
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
				fields.WithDefault(""),
				fields.WithHelp("Discord role ID allowed to run admin-only bot commands"),
			),
			fields.New(
				"discord-booker-role-id",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Discord role ID allowed to run show-management bot commands"),
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
	cfg.DiscordBotEnabled = s.DiscordBot
	cfg.DiscordBotScript = s.DiscordBotScript
	cfg.DiscordSyncOnStart = s.DiscordSyncOnStart
	cfg.DiscordDebug = s.DiscordDebug
	cfg.DiscordAdminRoleID = s.DiscordAdminRoleID
	cfg.DiscordBookerRoleID = s.DiscordBookerRoleID

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
