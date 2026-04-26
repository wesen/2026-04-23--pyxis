package postgres

import (
	"context"
	"encoding/json"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// AuditRepo implements repository.AuditLogRepository using sqlc-generated queries.
type AuditRepo struct {
	queries *db.Queries
}

// NewAuditRepo creates a new AuditRepo.
func NewAuditRepo(queries *db.Queries) *AuditRepo {
	return &AuditRepo{queries: queries}
}

// Create inserts a new audit log entry.
func (r *AuditRepo) Create(ctx context.Context, entry *domain.AuditLogEntry) (*domain.AuditLogEntry, error) {
	metadata, err := json.Marshal(entry.Metadata)
	if err != nil {
		return nil, err
	}

	params := db.CreateAuditLogParams{
		Actor:    entry.Actor,
		Action:   entry.Action,
		Metadata: metadata,
	}
	if entry.ActorID != nil {
		params.ActorID = pgtype.Int4{Int32: int32(*entry.ActorID), Valid: true}
	}
	if entry.EntityType != "" {
		params.EntityType = pgtype.Text{String: entry.EntityType, Valid: true}
	}
	if entry.EntityID != nil {
		params.EntityID = pgtype.Int4{Int32: int32(*entry.EntityID), Valid: true}
	}

	row, err := r.queries.CreateAuditLog(ctx, params)
	if err != nil {
		return nil, err
	}

	return dbAuditToDomain(row), nil
}

// List returns audit log entries with pagination.
func (r *AuditRepo) List(ctx context.Context, limit, offset int) ([]domain.AuditLogEntry, error) {
	rows, err := r.queries.ListAuditLog(ctx, db.ListAuditLogParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, err
	}

	entries := make([]domain.AuditLogEntry, len(rows))
	for i, row := range rows {
		entries[i] = *dbAuditToDomain(row)
	}
	return entries, nil
}

func dbAuditToDomain(row db.AuditLog) *domain.AuditLogEntry {
	entry := &domain.AuditLogEntry{
		ID:         int(row.ID),
		Actor:      row.Actor,
		Action:     row.Action,
		EntityType: row.EntityType.String,
		CreatedAt:  row.CreatedAt.Time,
	}
	if row.ActorID.Valid {
		v := int(row.ActorID.Int32)
		entry.ActorID = &v
	}
	if row.EntityID.Valid {
		v := int(row.EntityID.Int32)
		entry.EntityID = &v
	}
	if len(row.Metadata) > 0 {
		_ = json.Unmarshal(row.Metadata, &entry.Metadata)
	}
	return entry
}
