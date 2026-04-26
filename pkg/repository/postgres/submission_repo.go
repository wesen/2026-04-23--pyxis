package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// SubmissionRepo implements repository.SubmissionRepository.
type SubmissionRepo struct {
	queries *db.Queries
}

// NewSubmissionRepo creates a new SubmissionRepo.
func NewSubmissionRepo(queries *db.Queries) *SubmissionRepo {
	return &SubmissionRepo{queries: queries}
}

// Create stores a new booking submission.
func (r *SubmissionRepo) Create(ctx context.Context, s *domain.Submission) (*domain.Submission, error) {
	params := db.CreateSubmissionParams{
		ArtistName: s.ArtistName,
		Links:      pgtype.Text{String: s.Links, Valid: s.Links != ""},
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

	return rowToDomain(row), nil
}

func rowToDomain(row db.Submission) *domain.Submission {
	s := &domain.Submission{
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
		s.ArtistID = &v
	}
	if row.PreferredDate.Valid {
		s.PreferredDate = &row.PreferredDate.Time
	}
	if row.ExpectedDraw.Valid {
		v := int(row.ExpectedDraw.Int32)
		s.ExpectedDraw = &v
	}
	if row.ReviewedBy.Valid {
		v := int(row.ReviewedBy.Int32)
		s.ReviewedBy = &v
	}
	if row.ReviewedAt.Valid {
		s.ReviewedAt = &row.ReviewedAt.Time
	}
	return s
}
