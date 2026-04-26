package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// SubmissionRepo implements repository.SubmissionRepository using sqlc-generated queries.
type SubmissionRepo struct {
	queries *db.Queries
}

// NewSubmissionRepo creates a new SubmissionRepo.
func NewSubmissionRepo(queries *db.Queries) *SubmissionRepo {
	return &SubmissionRepo{queries: queries}
}

// Create inserts a new submission.
func (r *SubmissionRepo) Create(ctx context.Context, s *domain.Submission) (*domain.Submission, error) {
	params := db.CreateSubmissionParams{
		ArtistName: s.ArtistName,
	}
	if s.PreferredDate != nil {
		params.PreferredDate = pgtype.Date{Time: *s.PreferredDate, Valid: true}
	}
	if s.Genre != "" {
		params.Genre = pgtype.Text{String: s.Genre, Valid: true}
	}
	if s.ExpectedDraw != nil {
		params.ExpectedDraw = pgtype.Int4{Int32: int32(*s.ExpectedDraw), Valid: true}
	}
	if s.Links != "" {
		params.Links = pgtype.Text{String: s.Links, Valid: true}
	}
	if s.TechRider != "" {
		params.TechRider = pgtype.Text{String: s.TechRider, Valid: true}
	}
	if s.Message != "" {
		params.Message = pgtype.Text{String: s.Message, Valid: true}
	}
	if s.ContactDiscord != "" {
		params.ContactDiscord = pgtype.Text{String: s.ContactDiscord, Valid: true}
	}

	row, err := r.queries.CreateSubmission(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbSubmissionToDomain(row), nil
}

// GetByID returns a submission by ID.
func (r *SubmissionRepo) GetByID(ctx context.Context, id int) (*domain.Submission, error) {
	row, err := r.queries.GetSubmission(ctx, int32(id))
	if err != nil {
		return nil, err
	}
	return dbSubmissionToDomain(row), nil
}

// List returns submissions filtered by status (empty string = all).
func (r *SubmissionRepo) List(ctx context.Context, status string) ([]domain.Submission, error) {
	rows, err := r.queries.ListSubmissions(ctx, status)
	if err != nil {
		return nil, err
	}

	subs := make([]domain.Submission, len(rows))
	for i, row := range rows {
		subs[i] = *dbSubmissionToDomain(row)
	}
	return subs, nil
}

// Approve marks a submission as approved.
func (r *SubmissionRepo) Approve(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error) {
	row, err := r.queries.ApproveSubmission(ctx, db.ApproveSubmissionParams{
		ID:         int32(id),
		ReviewedBy: pgtype.Int4{Int32: int32(reviewedBy), Valid: true},
	})
	if err != nil {
		return nil, err
	}
	return dbSubmissionToDomain(row), nil
}

// Decline marks a submission as declined.
func (r *SubmissionRepo) Decline(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error) {
	row, err := r.queries.DeclineSubmission(ctx, db.DeclineSubmissionParams{
		ID:         int32(id),
		ReviewedBy: pgtype.Int4{Int32: int32(reviewedBy), Valid: true},
	})
	if err != nil {
		return nil, err
	}
	return dbSubmissionToDomain(row), nil
}

func dbSubmissionToDomain(row db.Submission) *domain.Submission {
	sub := &domain.Submission{
		ID:             int(row.ID),
		ArtistName:     row.ArtistName,
		Genre:          row.Genre.String,
		Links:          row.Links.String,
		TechRider:      row.TechRider.String,
		Message:        row.Message.String,
		ContactDiscord: row.ContactDiscord.String,
		Status:         row.Status,
		CreatedAt:      row.CreatedAt.Time,
	}
	if row.ArtistID.Valid {
		v := int(row.ArtistID.Int32)
		sub.ArtistID = &v
	}
	if row.PreferredDate.Valid {
		t := row.PreferredDate.Time
		sub.PreferredDate = &t
	}
	if row.ExpectedDraw.Valid {
		v := int(row.ExpectedDraw.Int32)
		sub.ExpectedDraw = &v
	}
	if row.ReviewedBy.Valid {
		v := int(row.ReviewedBy.Int32)
		sub.ReviewedBy = &v
	}
	if row.ReviewedAt.Valid {
		t := row.ReviewedAt.Time
		sub.ReviewedAt = &t
	}
	return sub
}
