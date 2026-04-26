package service

import (
	"context"
	"fmt"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// ShowService provides business logic for shows.
type ShowService struct {
	shows repository.ShowRepository
}

// NewShowService creates a new ShowService.
func NewShowService(shows repository.ShowRepository) *ShowService {
	return &ShowService{shows: shows}
}

// ListUpcoming returns confirmed shows for the public site.
func (s *ShowService) ListUpcoming(ctx context.Context) ([]domain.Show, error) {
	return s.shows.ListUpcoming(ctx)
}

// GetByID returns a single show by ID.
func (s *ShowService) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	return s.shows.GetByID(ctx, id)
}

// SearchArchive returns archived shows.
func (s *ShowService) SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error) {
	return s.shows.SearchArchive(ctx, query)
}

// GetArchiveStats returns archive aggregate stats.
func (s *ShowService) GetArchiveStats(ctx context.Context) (*domain.ArchiveStats, error) {
	return s.shows.GetArchiveStats(ctx)
}

// ErrNotFound is returned when an entity is not found.
var ErrNotFound = fmt.Errorf("not found")
