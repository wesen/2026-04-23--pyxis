package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// ShowLogService provides business logic for show logs.
type ShowLogService struct {
	showLog repository.ShowLogRepository
}

// NewShowLogService creates a new ShowLogService.
func NewShowLogService(showLog repository.ShowLogRepository) *ShowLogService {
	return &ShowLogService{showLog: showLog}
}

// GetByShowID returns the show log for a specific show.
func (s *ShowLogService) GetByShowID(ctx context.Context, showID int) (*domain.ShowLog, error) {
	return s.showLog.GetByShowID(ctx, showID)
}

// Upsert creates or updates a show log.
func (s *ShowLogService) Upsert(ctx context.Context, log *domain.ShowLog) (*domain.ShowLog, error) {
	return s.showLog.Upsert(ctx, log)
}

// List returns show logs with pagination.
func (s *ShowLogService) List(ctx context.Context, limit, offset int) ([]domain.ShowLog, error) {
	return s.showLog.List(ctx, limit, offset)
}
