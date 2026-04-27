package service

import (
	"context"
	"fmt"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
	"github.com/go-go-golems/pyxis/pkg/repository/postgres"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SubmissionService provides business logic for booking submissions.
type SubmissionService struct {
	submissions repository.SubmissionRepository
	shows       repository.ShowRepository
	artists     repository.ArtistRepository
	audit       AuditService
	pool        *pgxpool.Pool
}

// NewSubmissionService creates a new SubmissionService.
func NewSubmissionService(
	submissions repository.SubmissionRepository,
	shows repository.ShowRepository,
	artists repository.ArtistRepository,
	audit AuditService,
	pool *pgxpool.Pool,
) *SubmissionService {
	return &SubmissionService{
		submissions: submissions,
		shows:       shows,
		artists:     artists,
		audit:       audit,
		pool:        pool,
	}
}

// Create validates and stores a new booking submission.
func (s *SubmissionService) Create(ctx context.Context, req *domain.Submission) (*domain.Submission, error) {
	if req.ArtistName == "" {
		return nil, fmt.Errorf("artist name is required")
	}
	if req.Links == "" {
		return nil, fmt.Errorf("links are required")
	}
	return s.submissions.Create(ctx, req)
}

// List returns submissions filtered by status.
func (s *SubmissionService) List(ctx context.Context, status string) ([]domain.Submission, error) {
	return s.submissions.List(ctx, status)
}

// GetByID returns a single submission.
func (s *SubmissionService) GetByID(ctx context.Context, id int) (*domain.Submission, error) {
	return s.submissions.GetByID(ctx, id)
}

// GetReview returns staff review notes for a submission.
func (s *SubmissionService) GetReview(ctx context.Context, submissionID int) (*domain.BookingReview, error) {
	return s.submissions.GetReview(ctx, submissionID)
}

// UpsertReview stores staff review notes for a submission and logs the action.
func (s *SubmissionService) UpsertReview(ctx context.Context, review *domain.BookingReview, actorID int, actorName string) (*domain.BookingReview, error) {
	updated, err := s.submissions.UpsertReview(ctx, review)
	if err != nil {
		return nil, err
	}
	_ = s.audit.Log(ctx, actorID, actorName, "booking.review.update", "submission", &review.SubmissionID, map[string]interface{}{
		"decision": review.Decision,
	})
	return updated, nil
}

// Approve marks a submission as approved, creates or links an artist, and creates a draft show.
func (s *SubmissionService) Approve(ctx context.Context, id int, actorID int, actorName string) (*domain.Show, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := db.New(tx)
	subRepoTx := postgres.NewSubmissionRepo(qtx)
	artistRepoTx := postgres.NewArtistRepo(qtx)
	showRepoTx := postgres.NewShowRepo(qtx, nil)

	// Approve submission
	sub, err := subRepoTx.Approve(ctx, id, actorID)
	if err != nil {
		return nil, fmt.Errorf("approve submission: %w", err)
	}

	// Find or create artist
	artist, err := artistRepoTx.GetByName(ctx, sub.ArtistName)
	if err != nil {
		// Artist doesn't exist — create one
		artist, err = artistRepoTx.Create(ctx, &domain.Artist{
			Name:  sub.ArtistName,
			Genre: sub.Genre,
			Links: sub.Links,
		})
		if err != nil {
			return nil, fmt.Errorf("create artist: %w", err)
		}
	}

	// Create draft show from submission
	if sub.PreferredDate == nil || sub.PreferredDate.IsZero() {
		return nil, fmt.Errorf("submission has no preferred date")
	}

	show := &domain.Show{
		Artist:       sub.ArtistName,
		Date:         *sub.PreferredDate,
		Genre:        sub.Genre,
		Status:       "draft",
		SubmissionID: &sub.ID,
		ArtistID:     &artist.ID,
		CreatedBy:    &actorID,
	}

	created, err := showRepoTx.Create(ctx, show)
	if err != nil {
		return nil, fmt.Errorf("create show: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit tx: %w", err)
	}

	_ = s.audit.Log(ctx, actorID, actorName, "submission.approve", "submission", &id, map[string]interface{}{
		"artist": sub.ArtistName,
		"showId": created.ID,
	})

	return created, nil
}

// Decline marks a submission as declined.
func (s *SubmissionService) Decline(ctx context.Context, id int, actorID int, actorName string) error {
	_, err := s.submissions.Decline(ctx, id, actorID)
	if err != nil {
		return err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "submission.decline", "submission", &id, map[string]interface{}{
		"actor": actorName,
	})

	return nil
}
