package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// ShowLogRepo implements repository.ShowLogRepository using sqlc-generated queries.
type ShowLogRepo struct {
	queries *db.Queries
}

// NewShowLogRepo creates a new ShowLogRepo.
func NewShowLogRepo(queries *db.Queries) *ShowLogRepo {
	return &ShowLogRepo{queries: queries}
}

// GetByShowID returns an show log by show ID.
func (r *ShowLogRepo) GetByShowID(ctx context.Context, showID int) (*domain.ShowLog, error) {
	row, err := r.queries.GetShowLog(ctx, int32(showID))
	if err != nil {
		return nil, err
	}
	return dbShowLogToDomain(row), nil
}

// Upsert creates or updates an show log.
func (r *ShowLogRepo) Upsert(ctx context.Context, log *domain.ShowLog) (*domain.ShowLog, error) {
	params := db.UpsertShowLogParams{
		ShowID: int32(log.ShowID),
	}
	if log.Draw != nil {
		params.Draw = pgtype.Int4{Int32: int32(*log.Draw), Valid: true}
	}
	if log.Notes != "" {
		params.Notes = pgtype.Text{String: log.Notes, Valid: true}
	}
	params.Incident = pgtype.Bool{Bool: log.Incident, Valid: true}
	if log.IncidentNotes != "" {
		params.IncidentNotes = pgtype.Text{String: log.IncidentNotes, Valid: true}
	}
	if log.LoggedBy != nil {
		params.LoggedBy = pgtype.Int4{Int32: int32(*log.LoggedBy), Valid: true}
	}
	if log.QuickHighlight != "" {
		params.QuickHighlight = pgtype.Text{String: log.QuickHighlight, Valid: true}
	}
	if log.TotalDoorCents != nil {
		params.TotalDoorCents = pgtype.Int4{Int32: int32(*log.TotalDoorCents), Valid: true}
	}

	row, err := r.queries.UpsertShowLog(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbShowLogToDomain(row), nil
}

// List returns show logs with pagination.
func (r *ShowLogRepo) List(ctx context.Context, limit, offset int) ([]domain.ShowLog, error) {
	rows, err := r.queries.ListShowLogs(ctx, db.ListShowLogsParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, err
	}

	logs := make([]domain.ShowLog, len(rows))
	for i, row := range rows {
		logs[i] = *dbShowLogListRowToDomain(row)
	}
	return logs, nil
}

func dbShowLogToDomain(row db.ShowLog) *domain.ShowLog {
	log := &domain.ShowLog{
		ID:             int(row.ID),
		ShowID:         int(row.ShowID),
		Notes:          row.Notes.String,
		QuickHighlight: row.QuickHighlight.String,
		Incident:       row.Incident.Bool,
		IncidentNotes:  row.IncidentNotes.String,
		CreatedAt:      row.CreatedAt.Time,
		UpdatedAt:      row.UpdatedAt.Time,
	}
	if row.Draw.Valid {
		v := int(row.Draw.Int32)
		log.Draw = &v
	}
	if row.LoggedBy.Valid {
		v := int(row.LoggedBy.Int32)
		log.LoggedBy = &v
	}
	if row.TotalDoorCents.Valid {
		v := int(row.TotalDoorCents.Int32)
		log.TotalDoorCents = &v
	}
	return log
}

func dbShowLogListRowToDomain(row db.ListShowLogsRow) *domain.ShowLog {
	log := &domain.ShowLog{
		ID:             int(row.ID),
		ShowID:         int(row.ShowID),
		Artist:         row.Artist,
		Date:           row.Date.Time,
		Notes:          row.Notes.String,
		QuickHighlight: row.QuickHighlight.String,
		Incident:       row.Incident.Bool,
		IncidentNotes:  row.IncidentNotes.String,
		CreatedAt:      row.CreatedAt.Time,
		UpdatedAt:      row.UpdatedAt.Time,
	}
	if row.Draw.Valid {
		v := int(row.Draw.Int32)
		log.Draw = &v
	}
	if row.LoggedBy.Valid {
		v := int(row.LoggedBy.Int32)
		log.LoggedBy = &v
	}
	if row.TotalDoorCents.Valid {
		v := int(row.TotalDoorCents.Int32)
		log.TotalDoorCents = &v
	}
	return log
}
