package repository

import (
	"context"
	"time"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

// ShowRepository defines show storage operations.
type ShowRepository interface {
	ListUpcoming(ctx context.Context) ([]domain.Show, error)
	ListAll(ctx context.Context) ([]domain.Show, error)
	GetByID(ctx context.Context, id int) (*domain.Show, error)
	Create(ctx context.Context, show *domain.Show) (*domain.Show, error)
	Update(ctx context.Context, show *domain.Show) (*domain.Show, error)
	AttachDiscordMessage(ctx context.Context, id int, channelID, messageID string) (*domain.Show, error)
	GetByDiscordMessage(ctx context.Context, channelID, messageID string) (*domain.Show, error)
	ListExpiredConfirmed(ctx context.Context, before time.Time) ([]domain.Show, error)
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
	UpdateDetails(ctx context.Context, submission *domain.Submission) (*domain.Submission, error)
	GetReview(ctx context.Context, submissionID int) (*domain.BookingReview, error)
	UpsertReview(ctx context.Context, review *domain.BookingReview) (*domain.BookingReview, error)
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
	List(ctx context.Context, limit, offset int) ([]domain.AuditLogEntry, error)
}

// SettingsRepository defines settings storage operations.
type SettingsRepository interface {
	Get(ctx context.Context) (*domain.Settings, error)
	Update(ctx context.Context, settings *domain.Settings) (*domain.Settings, error)
}

// CalendarRepository defines calendar storage operations.
type CalendarRepository interface {
	ListHolds(ctx context.Context) ([]domain.CalendarHold, error)
	CreateHold(ctx context.Context, hold *domain.CalendarHold) (*domain.CalendarHold, error)
	DeleteHold(ctx context.Context, id int) error
	ListBlocked(ctx context.Context) ([]domain.CalendarBlocked, error)
	CreateBlocked(ctx context.Context, blocked *domain.CalendarBlocked) (*domain.CalendarBlocked, error)
	DeleteBlocked(ctx context.Context, id int) error
}

// ShowLogRepository defines show log storage operations.
type ShowLogRepository interface {
	GetByShowID(ctx context.Context, showID int) (*domain.ShowLog, error)
	Upsert(ctx context.Context, log *domain.ShowLog) (*domain.ShowLog, error)
	List(ctx context.Context, limit, offset int) ([]domain.ShowLog, error)
}
