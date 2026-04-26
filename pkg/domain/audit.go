package domain

import "time"

// AuditLogEntry is an append-only record of staff actions.
type AuditLogEntry struct {
	ID         int
	Actor      string
	ActorID    *int
	Action     string
	EntityType string
	EntityID   *int
	Metadata   map[string]interface{}
	CreatedAt  time.Time
}
