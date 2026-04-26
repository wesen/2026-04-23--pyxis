package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// CalendarRepo implements repository.CalendarRepository using sqlc-generated queries.
type CalendarRepo struct {
	queries *db.Queries
}

// NewCalendarRepo creates a new CalendarRepo.
func NewCalendarRepo(queries *db.Queries) *CalendarRepo {
	return &CalendarRepo{queries: queries}
}

// ListHolds returns all calendar holds.
func (r *CalendarRepo) ListHolds(ctx context.Context) ([]domain.CalendarHold, error) {
	rows, err := r.queries.ListCalendarHolds(ctx)
	if err != nil {
		return nil, err
	}

	holds := make([]domain.CalendarHold, len(rows))
	for i, row := range rows {
		holds[i] = *dbHoldToDomain(row)
	}
	return holds, nil
}

// CreateHold inserts a new calendar hold.
func (r *CalendarRepo) CreateHold(ctx context.Context, hold *domain.CalendarHold) (*domain.CalendarHold, error) {
	params := db.CreateCalendarHoldParams{
		Date: pgtype.Date{Time: hold.Date, Valid: true},
	}
	if hold.Label != "" {
		params.Label = pgtype.Text{String: hold.Label, Valid: true}
	}
	if hold.CreatedBy != nil {
		params.CreatedBy = pgtype.Int4{Int32: int32(*hold.CreatedBy), Valid: true}
	}

	row, err := r.queries.CreateCalendarHold(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbHoldToDomain(row), nil
}

// DeleteHold removes a calendar hold.
func (r *CalendarRepo) DeleteHold(ctx context.Context, id int) error {
	return r.queries.DeleteCalendarHold(ctx, int32(id))
}

// ListBlocked returns all blocked calendar dates.
func (r *CalendarRepo) ListBlocked(ctx context.Context) ([]domain.CalendarBlocked, error) {
	rows, err := r.queries.ListCalendarBlocked(ctx)
	if err != nil {
		return nil, err
	}

	blocked := make([]domain.CalendarBlocked, len(rows))
	for i, row := range rows {
		blocked[i] = *dbBlockedToDomain(row)
	}
	return blocked, nil
}

// CreateBlocked inserts a new blocked date.
func (r *CalendarRepo) CreateBlocked(ctx context.Context, b *domain.CalendarBlocked) (*domain.CalendarBlocked, error) {
	params := db.CreateCalendarBlockedParams{
		Date: pgtype.Date{Time: b.Date, Valid: true},
	}
	if b.Reason != "" {
		params.Reason = pgtype.Text{String: b.Reason, Valid: true}
	}
	if b.CreatedBy != nil {
		params.CreatedBy = pgtype.Int4{Int32: int32(*b.CreatedBy), Valid: true}
	}

	row, err := r.queries.CreateCalendarBlocked(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbBlockedToDomain(row), nil
}

// DeleteBlocked removes a blocked date.
func (r *CalendarRepo) DeleteBlocked(ctx context.Context, id int) error {
	return r.queries.DeleteCalendarBlocked(ctx, int32(id))
}

func dbHoldToDomain(row db.CalendarHold) *domain.CalendarHold {
	hold := &domain.CalendarHold{
		ID:        int(row.ID),
		Date:      row.Date.Time,
		Label:     row.Label.String,
		CreatedAt: row.CreatedAt.Time,
	}
	if row.CreatedBy.Valid {
		v := int(row.CreatedBy.Int32)
		hold.CreatedBy = &v
	}
	return hold
}

func dbBlockedToDomain(row db.CalendarBlocked) *domain.CalendarBlocked {
	b := &domain.CalendarBlocked{
		ID:        int(row.ID),
		Date:      row.Date.Time,
		Reason:    row.Reason.String,
		CreatedAt: row.CreatedAt.Time,
	}
	if row.CreatedBy.Valid {
		v := int(row.CreatedBy.Int32)
		b.CreatedBy = &v
	}
	return b
}
