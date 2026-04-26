package repository

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

// ShowRepository defines show storage operations.
type ShowRepository interface {
	ListUpcoming(ctx context.Context) ([]domain.Show, error)
	ListAll(ctx context.Context) ([]domain.Show, error)
	GetByID(ctx context.Context, id int) (*domain.Show, error)
	Create(ctx context.Context, show *domain.Show) (*domain.Show, error)
	Update(ctx context.Context, show *domain.Show) (*domain.Show, error)
	Archive(ctx context.Context, id int) error
	SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error)
	GetArchiveStats(ctx context.Context) (*domain.ArchiveStats, error)
}

// SubmissionRepository defines submission storage operations.
type SubmissionRepository interface {
	Create(ctx context.Context, s *domain.Submission) (*domain.Submission, error)
	GetByID(ctx context.Context, id int) (*domain.Submission, error)
	List(ctx context.Context, status string) ([]domain.Submission, error)
	Approve(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error)
	Decline(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error)
}

// ArtistRepository defines artist storage operations.
type ArtistRepository interface {
	List(ctx context.Context) ([]domain.Artist, error)
	GetByID(ctx context.Context, id int) (*domain.Artist, error)
	GetByName(ctx context.Context, name string) (*domain.Artist, error)
	Create(ctx context.Context, artist *domain.Artist) (*domain.Artist, error)
	Update(ctx context.Context, artist *domain.Artist) (*domain.Artist, error)
}

// AuditLogRepository defines audit log storage operations.
type AuditLogRepository interface {
	Create(ctx context.Context, entry *domain.AuditLogEntry) (*domain.AuditLogEntry, error)
}
