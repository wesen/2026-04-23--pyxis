package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// AttendanceService provides business logic for attendance logs.
type AttendanceService struct {
	attendance repository.AttendanceRepository
}

// NewAttendanceService creates a new AttendanceService.
func NewAttendanceService(attendance repository.AttendanceRepository) *AttendanceService {
	return &AttendanceService{attendance: attendance}
}

// GetByShowID returns attendance for a specific show.
func (s *AttendanceService) GetByShowID(ctx context.Context, showID int) (*domain.AttendanceLog, error) {
	return s.attendance.GetByShowID(ctx, showID)
}

// Upsert creates or updates an attendance log.
func (s *AttendanceService) Upsert(ctx context.Context, log *domain.AttendanceLog) (*domain.AttendanceLog, error) {
	return s.attendance.Upsert(ctx, log)
}

// List returns attendance logs with pagination.
func (s *AttendanceService) List(ctx context.Context, limit, offset int) ([]domain.AttendanceLog, error) {
	return s.attendance.List(ctx, limit, offset)
}
