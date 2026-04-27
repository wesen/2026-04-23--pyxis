package discordbot

import (
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/discord"
	"github.com/go-go-golems/pyxis/pkg/repository/postgres"
	"github.com/go-go-golems/pyxis/pkg/service"
)

// NewDeps builds the Pyxis service dependencies used by the embedded bot.
func NewDeps(database *db.Pool) Deps {
	queries := db.New(database.Pool)
	showRepo := postgres.NewShowRepo(queries, database.Pool)
	auditRepo := postgres.NewAuditRepo(queries)
	settingsRepo := postgres.NewSettingsRepo(queries)
	auditService := service.NewAuditService(auditRepo)
	return Deps{
		Shows:    service.NewShowService(showRepo, auditService, discord.Client(&discord.NoOpClient{})),
		Settings: service.NewSettingsService(settingsRepo),
		Audit:    auditService,
	}
}
