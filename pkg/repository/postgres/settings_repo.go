package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// SettingsRepo implements repository.SettingsRepository using sqlc-generated queries.
type SettingsRepo struct {
	queries *db.Queries
}

// NewSettingsRepo creates a new SettingsRepo.
func NewSettingsRepo(queries *db.Queries) *SettingsRepo {
	return &SettingsRepo{queries: queries}
}

// Get returns the single settings row.
func (r *SettingsRepo) Get(ctx context.Context) (*domain.Settings, error) {
	row, err := r.queries.GetSettings(ctx)
	if err != nil {
		return nil, err
	}
	return dbSettingsToDomain(row), nil
}

// Update modifies the single settings row.
func (r *SettingsRepo) Update(ctx context.Context, settings *domain.Settings) (*domain.Settings, error) {
	params := db.UpdateSettingsParams{
		SpaceName: settings.SpaceName,
	}
	if settings.Tagline != "" {
		params.Tagline = pgtype.Text{String: settings.Tagline, Valid: true}
	}
	if settings.Address != "" {
		params.Address = pgtype.Text{String: settings.Address, Valid: true}
	}
	if settings.Capacity != nil {
		params.Capacity = pgtype.Int4{Int32: int32(*settings.Capacity), Valid: true}
	}
	if settings.ContactEmail != "" {
		params.ContactEmail = pgtype.Text{String: settings.ContactEmail, Valid: true}
	}
	if settings.Website != "" {
		params.Website = pgtype.Text{String: settings.Website, Valid: true}
	}
	if settings.DiscordGuildID != "" {
		params.DiscordGuildID = pgtype.Text{String: settings.DiscordGuildID, Valid: true}
	}
	if settings.DiscordChUpcoming != "" {
		params.DiscordChUpcoming = pgtype.Text{String: settings.DiscordChUpcoming, Valid: true}
	}
	if settings.DiscordChAnnouncements != "" {
		params.DiscordChAnnouncements = pgtype.Text{String: settings.DiscordChAnnouncements, Valid: true}
	}
	if settings.DiscordChStaff != "" {
		params.DiscordChStaff = pgtype.Text{String: settings.DiscordChStaff, Valid: true}
	}
	if settings.DiscordChBookings != "" {
		params.DiscordChBookings = pgtype.Text{String: settings.DiscordChBookings, Valid: true}
	}
	params.SetupComplete = pgtype.Bool{Bool: settings.SetupComplete, Valid: true}

	row, err := r.queries.UpdateSettings(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbSettingsToDomain(row), nil
}

func dbSettingsToDomain(row db.Setting) *domain.Settings {
	settings := &domain.Settings{
		ID:                     int(row.ID),
		SpaceName:              row.SpaceName,
		Tagline:                row.Tagline.String,
		Address:                row.Address.String,
		ContactEmail:           row.ContactEmail.String,
		Website:                row.Website.String,
		DiscordGuildID:         row.DiscordGuildID.String,
		DiscordChUpcoming:      row.DiscordChUpcoming.String,
		DiscordChAnnouncements: row.DiscordChAnnouncements.String,
		DiscordChStaff:         row.DiscordChStaff.String,
		DiscordChBookings:      row.DiscordChBookings.String,
		SetupComplete:          row.SetupComplete.Bool,
		UpdatedAt:              row.UpdatedAt.Time,
	}
	if row.Capacity.Valid {
		v := int(row.Capacity.Int32)
		settings.Capacity = &v
	}
	return settings
}

func strPtrToPgtypeText(s *string) pgtype.Text {
	if s == nil || *s == "" {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{String: *s, Valid: true}
}
