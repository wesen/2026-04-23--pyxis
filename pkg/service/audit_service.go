package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// AuditService provides audit logging for staff actions.
type AuditService interface {
	Log(ctx context.Context, actorID int, actorName, action, entityType string, entityID *int, metadata map[string]interface{}) error
	List(ctx context.Context, limit, offset int) ([]domain.AuditLogEntry, error)
}

// auditService implements AuditService.
type auditService struct {
	repo repository.AuditLogRepository
}

// NewAuditService creates a new AuditService.
func NewAuditService(repo repository.AuditLogRepository) AuditService {
	return &auditService{repo: repo}
}

// List returns audit log entries with pagination.
func (s *auditService) List(ctx context.Context, limit, offset int) ([]domain.AuditLogEntry, error) {
	return s.repo.List(ctx, limit, offset)
}

// Log records an audit entry.
func (s *auditService) Log(ctx context.Context, actorID int, actorName, action, entityType string, entityID *int, metadata map[string]interface{}) error {
	entry := &domain.AuditLogEntry{
		Actor:      actorName,
		Action:     action,
		EntityType: entityType,
		Metadata:   metadata,
	}
	if actorID > 0 {
		entry.ActorID = &actorID
	}
	if entityID != nil && *entityID > 0 {
		entry.EntityID = entityID
	}
	_, err := s.repo.Create(ctx, entry)
	return err
}
