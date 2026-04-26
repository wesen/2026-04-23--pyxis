package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// CalendarService provides business logic for calendar operations.
type CalendarService struct {
	calendar repository.CalendarRepository
}

// NewCalendarService creates a new CalendarService.
func NewCalendarService(calendar repository.CalendarRepository) *CalendarService {
	return &CalendarService{calendar: calendar}
}

// ListHolds returns all calendar holds.
func (s *CalendarService) ListHolds(ctx context.Context) ([]domain.CalendarHold, error) {
	return s.calendar.ListHolds(ctx)
}

// CreateHold adds a new calendar hold.
func (s *CalendarService) CreateHold(ctx context.Context, hold *domain.CalendarHold) (*domain.CalendarHold, error) {
	return s.calendar.CreateHold(ctx, hold)
}

// DeleteHold removes a calendar hold.
func (s *CalendarService) DeleteHold(ctx context.Context, id int) error {
	return s.calendar.DeleteHold(ctx, id)
}

// ListBlocked returns all blocked calendar dates.
func (s *CalendarService) ListBlocked(ctx context.Context) ([]domain.CalendarBlocked, error) {
	return s.calendar.ListBlocked(ctx)
}

// CreateBlocked adds a new blocked date.
func (s *CalendarService) CreateBlocked(ctx context.Context, b *domain.CalendarBlocked) (*domain.CalendarBlocked, error) {
	return s.calendar.CreateBlocked(ctx, b)
}

// DeleteBlocked removes a blocked date.
func (s *CalendarService) DeleteBlocked(ctx context.Context, id int) error {
	return s.calendar.DeleteBlocked(ctx, id)
}
