package service

import (
	"context"
	"fmt"
	"time"

	"github.com/go-go-golems/pyxis/pkg/discord"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// ShowService provides business logic for shows.
type ShowService struct {
	shows   repository.ShowRepository
	audit   AuditService
	discord discord.Client
}

// NewShowService creates a new ShowService.
func NewShowService(shows repository.ShowRepository, audit AuditService, discordClient discord.Client) *ShowService {
	if discordClient == nil {
		discordClient = &discord.NoOpClient{}
	}
	return &ShowService{shows: shows, audit: audit, discord: discordClient}
}

// ListUpcoming returns confirmed shows for the public site.
func (s *ShowService) ListUpcoming(ctx context.Context) ([]domain.Show, error) {
	return s.shows.ListUpcoming(ctx)
}

// ListAll returns all shows for staff.
func (s *ShowService) ListAll(ctx context.Context) ([]domain.Show, error) {
	return s.shows.ListAll(ctx)
}

// GetByID returns a single show by ID.
func (s *ShowService) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	return s.shows.GetByID(ctx, id)
}

// Create creates a new show and logs the action.
func (s *ShowService) Create(ctx context.Context, show *domain.Show, actorID int, actorName string) (*domain.Show, error) {
	if show.Status == "" {
		show.Status = "draft"
	}
	created, err := s.shows.Create(ctx, show)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.create", "show", &created.ID, map[string]interface{}{
		"artist": show.Artist,
		"date":   show.Date.Format("2006-01-02"),
		"status": show.Status,
	})

	return created, nil
}

// Update modifies an existing show and logs the action.
func (s *ShowService) Update(ctx context.Context, show *domain.Show, actorID int, actorName string) (*domain.Show, error) {
	updated, err := s.shows.Update(ctx, show)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.update", "show", &show.ID, map[string]interface{}{
		"artist": show.Artist,
		"date":   show.Date.Format("2006-01-02"),
		"status": show.Status,
	})

	return updated, nil
}

// Cancel marks a show as cancelled and logs the action.
func (s *ShowService) Cancel(ctx context.Context, id int, actorID int, actorName string) (*domain.Show, error) {
	show, err := s.shows.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	show.Status = "cancelled"
	updated, err := s.shows.Update(ctx, show)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.cancel", "show", &id, map[string]interface{}{
		"artist": show.Artist,
	})

	return updated, nil
}

// Announce posts a show announcement to Discord.
func (s *ShowService) Announce(ctx context.Context, id int, actorID int, actorName string) error {
	show, err := s.shows.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.discord.AnnounceShow(ctx, id, show.Artist, show.Date.Format("2006-01-02")); err != nil {
		return fmt.Errorf("discord announce: %w", err)
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.announce", "show", &id, map[string]interface{}{
		"artist": show.Artist,
	})

	return nil
}

// AttachDiscordMessage stores the Discord channel/message IDs associated with a show announcement.
func (s *ShowService) AttachDiscordMessage(ctx context.Context, id int, channelID, messageID string) (*domain.Show, error) {
	return s.shows.AttachDiscordMessage(ctx, id, channelID, messageID)
}

// GetByDiscordMessage finds a show by its Discord announcement message.
func (s *ShowService) GetByDiscordMessage(ctx context.Context, channelID, messageID string) (*domain.Show, error) {
	return s.shows.GetByDiscordMessage(ctx, channelID, messageID)
}

// ListExpiredConfirmed returns confirmed shows before the provided date.
func (s *ShowService) ListExpiredConfirmed(ctx context.Context, before time.Time) ([]domain.Show, error) {
	return s.shows.ListExpiredConfirmed(ctx, before)
}

// Archive marks a show as archived and logs the action.
func (s *ShowService) Archive(ctx context.Context, id int, actorID int, actorName string) error {
	show, err := s.shows.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.shows.Archive(ctx, id); err != nil {
		return err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.archive", "show", &id, map[string]interface{}{
		"artist": show.Artist,
	})

	return nil
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
