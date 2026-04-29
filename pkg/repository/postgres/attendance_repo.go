package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// AttendanceRepo implements repository.AttendanceRepository using sqlc-generated queries.
type AttendanceRepo struct {
	queries *db.Queries
}

// NewAttendanceRepo creates a new AttendanceRepo.
func NewAttendanceRepo(queries *db.Queries) *AttendanceRepo {
	return &AttendanceRepo{queries: queries}
}

// GetByShowID returns an attendance log by show ID.
func (r *AttendanceRepo) GetByShowID(ctx context.Context, showID int) (*domain.AttendanceLog, error) {
	row, err := r.queries.GetAttendanceLog(ctx, int32(showID))
	if err != nil {
		return nil, err
	}
	return dbAttendanceToDomain(row), nil
}

// Upsert creates or updates an attendance log.
func (r *AttendanceRepo) Upsert(ctx context.Context, log *domain.AttendanceLog) (*domain.AttendanceLog, error) {
	params := db.UpsertAttendanceLogParams{
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

	row, err := r.queries.UpsertAttendanceLog(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbAttendanceToDomain(row), nil
}

// List returns attendance logs with pagination.
func (r *AttendanceRepo) List(ctx context.Context, limit, offset int) ([]domain.AttendanceLog, error) {
	rows, err := r.queries.ListAttendanceLogs(ctx, db.ListAttendanceLogsParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, err
	}

	logs := make([]domain.AttendanceLog, len(rows))
	for i, row := range rows {
		logs[i] = *dbAttendanceListRowToDomain(row)
	}
	return logs, nil
}

func dbAttendanceToDomain(row db.AttendanceLog) *domain.AttendanceLog {
	log := &domain.AttendanceLog{
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

func dbAttendanceListRowToDomain(row db.ListAttendanceLogsRow) *domain.AttendanceLog {
	log := &domain.AttendanceLog{
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
