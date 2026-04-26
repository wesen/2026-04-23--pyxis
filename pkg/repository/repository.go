package repository

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

// ShowRepository defines show storage operations.
type ShowRepository interface {
	ListUpcoming(ctx context.Context) ([]domain.Show, error)
	GetByID(ctx context.Context, id int) (*domain.Show, error)
	SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error)
	GetArchiveStats(ctx context.Context) (*domain.ArchiveStats, error)
}

// SubmissionRepository defines submission storage operations.
type SubmissionRepository interface {
	Create(ctx context.Context, s *domain.Submission) (*domain.Submission, error)
}
