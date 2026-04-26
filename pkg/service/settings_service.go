package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// SettingsService provides business logic for space settings.
type SettingsService struct {
	settings repository.SettingsRepository
}

// NewSettingsService creates a new SettingsService.
func NewSettingsService(settings repository.SettingsRepository) *SettingsService {
	return &SettingsService{settings: settings}
}

// Get returns the current settings.
func (s *SettingsService) Get(ctx context.Context) (*domain.Settings, error) {
	return s.settings.Get(ctx)
}

// Update modifies the settings.
func (s *SettingsService) Update(ctx context.Context, settings *domain.Settings) (*domain.Settings, error) {
	return s.settings.Update(ctx, settings)
}
