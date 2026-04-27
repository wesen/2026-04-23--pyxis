package discordbot

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/go-go-golems/discord-bot/pkg/framework"
	"github.com/rs/zerolog/log"
)

// Config describes the embedded Pyxis Discord bot runtime.
type Config struct {
	Enabled       bool
	ScriptPath    string
	SyncOnStart   bool
	Debug         bool
	AdminRoleID   string
	BookerRoleID  string
	RuntimeConfig map[string]any
	Credentials   framework.Credentials
}

// Runner owns the embedded Discord bot lifecycle.
type Runner struct {
	bot *framework.Bot
}

// NewRunner constructs the embedded Pyxis Discord bot.
func NewRunner(ctx context.Context, cfg Config, deps Deps) (*Runner, error) {
	if !cfg.Enabled {
		return nil, fmt.Errorf("discord bot is disabled")
	}
	if strings.TrimSpace(cfg.ScriptPath) == "" {
		return nil, fmt.Errorf("discord bot script path is required")
	}
	credentials := cfg.Credentials
	if credentials.BotToken == "" && credentials.ApplicationID == "" {
		credentials = CredentialsFromEnv()
	}
	runtimeConfig := cloneRuntimeConfig(cfg.RuntimeConfig)
	if cfg.Debug {
		runtimeConfig["debug"] = true
	}
	if cfg.AdminRoleID != "" {
		runtimeConfig["adminRoleId"] = cfg.AdminRoleID
	}
	if cfg.BookerRoleID != "" {
		runtimeConfig["bookerRoleId"] = cfg.BookerRoleID
	}

	bot, err := framework.New(
		framework.WithCredentials(credentials),
		framework.WithScript(cfg.ScriptPath),
		framework.WithRuntimeConfig(runtimeConfig),
		framework.WithRuntimeModuleRegistrars(NewPyxisRegistrar(ctx, deps)),
		framework.WithSyncOnStart(cfg.SyncOnStart),
	)
	if err != nil {
		return nil, fmt.Errorf("create Discord bot framework runtime: %w", err)
	}
	return &Runner{bot: bot}, nil
}

// CredentialsFromEnv loads Discord credentials from the standard framework env vars.
func CredentialsFromEnv() framework.Credentials {
	return framework.Credentials{
		BotToken:      os.Getenv("DISCORD_BOT_TOKEN"),
		ApplicationID: os.Getenv("DISCORD_APPLICATION_ID"),
		GuildID:       os.Getenv("DISCORD_GUILD_ID"),
		PublicKey:     os.Getenv("DISCORD_PUBLIC_KEY"),
		ClientID:      os.Getenv("DISCORD_CLIENT_ID"),
		ClientSecret:  os.Getenv("DISCORD_CLIENT_SECRET"),
	}
}

// Run opens the Discord connection and blocks until ctx is canceled.
func (r *Runner) Run(ctx context.Context) error {
	if r == nil || r.bot == nil {
		return nil
	}
	log.Info().Msg("starting embedded Discord bot")
	return r.bot.Run(ctx)
}

// Close releases bot resources.
func (r *Runner) Close() error {
	if r == nil || r.bot == nil {
		return nil
	}
	return r.bot.Close()
}

func cloneRuntimeConfig(input map[string]any) map[string]any {
	ret := map[string]any{}
	for key, value := range input {
		ret[key] = value
	}
	return ret
}
