package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/pkg/discord"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/gcal"
	"github.com/go-go-golems/pyxis/pkg/repository"
	"github.com/rs/zerolog/log"
)

// ShowService provides business logic for shows.
type ShowService struct {
	shows       repository.ShowRepository
	audit       AuditService
	discord     discord.Client
	gcalClient  *gcal.Client
	settings    repository.SettingsRepository
}

// NewShowService creates a new ShowService.
func NewShowService(shows repository.ShowRepository, audit AuditService, discordClient discord.Client) *ShowService {
	if discordClient == nil {
		discordClient = &discord.NoOpClient{}
	}
	return &ShowService{shows: shows, audit: audit, discord: discordClient}
}

// SetGoogleCalClient sets the Google Calendar client for show sync.
func (s *ShowService) SetGoogleCalClient(client *gcal.Client) {
	s.gcalClient = client
}

// SetSettingsRepo sets the settings repository for sync.
func (s *ShowService) SetSettingsRepo(settings repository.SettingsRepository) {
	s.settings = settings
}

// ListUpcoming returns confirmed shows that are ready for the public site.
func (s *ShowService) ListUpcoming(ctx context.Context) ([]domain.Show, error) {
	shows, err := s.shows.ListUpcoming(ctx)
	if err != nil {
		return nil, err
	}
	public := make([]domain.Show, 0, len(shows))
	for _, show := range shows {
		if hasPublicFlyer(show.FlyerURL) {
			public = append(public, show)
		}
	}
	return public, nil
}

// ListAll returns all shows for staff.
func (s *ShowService) ListAll(ctx context.Context) ([]domain.Show, error) {
	return s.shows.ListAll(ctx)
}

// GetByID returns a single show by ID.
func (s *ShowService) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	return s.shows.GetByID(ctx, id)
}

// GetPublicByID returns a show only when it is visible on the public site.
// Public detail pages should not expose draft, hold, blocked, cancelled,
// archived, or flyer-less shows just because a user guesses an integer ID.
func (s *ShowService) GetPublicByID(ctx context.Context, id int) (*domain.Show, error) {
	show, err := s.shows.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if show.Status != domain.StatusConfirmed || show.Date.Before(time.Now().Truncate(24*time.Hour)) || !hasPublicFlyer(show.FlyerURL) {
		return nil, ErrNotFound
	}
	return show, nil
}

func hasPublicFlyer(flyerURL string) bool {
	return strings.TrimSpace(flyerURL) != ""
}

func validateShowStatus(show *domain.Show) error {
	if show.Status == domain.StatusConfirmed && !hasPublicFlyer(show.FlyerURL) {
		return fmt.Errorf("%w: confirmed shows require an uploaded flyer", ErrValidation)
	}
	return nil
}

// Create creates a new show and logs the action.
func (s *ShowService) Create(ctx context.Context, show *domain.Show, actorID int, actorName string) (*domain.Show, error) {
	if show.Status == "" {
		show.Status = "draft"
	}
	if err := validateShowStatus(show); err != nil {
		return nil, err
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

	// Sync to Google Calendar (only for confirmed shows)
	if created.Status == domain.StatusConfirmed {
		go s.syncShowToGCal(context.Background(), created)
	}

	return created, nil
}

// Update modifies an existing show and logs the action.
func (s *ShowService) Update(ctx context.Context, show *domain.Show, actorID int, actorName string) (*domain.Show, error) {
	if err := validateShowStatus(show); err != nil {
		return nil, err
	}
	updated, err := s.shows.Update(ctx, show)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, actorID, actorName, "show.update", "show", &show.ID, map[string]interface{}{
		"artist": show.Artist,
		"date":   show.Date.Format("2006-01-02"),
		"status": show.Status,
	})

	// Sync to Google Calendar
	if updated.Status == domain.StatusConfirmed {
		go s.syncShowToGCal(context.Background(), updated)
	} else if updated.Status == domain.StatusCancelled && updated.GoogleCalEventID != "" {
		go s.deleteGCalEvent(context.Background(), updated.GoogleCalEventID, updated.ID)
	}

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

	// Delete from Google Calendar
	if updated.GoogleCalEventID != "" {
		go s.deleteGCalEvent(context.Background(), updated.GoogleCalEventID, id)
	}

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

// syncShowToGCal syncs a show to Google Calendar if the integration is enabled.
// It's designed to be called after a successful DB write — errors are logged but
// do NOT fail the overall operation.
func (s *ShowService) syncShowToGCal(ctx context.Context, show *domain.Show) {
	if s.gcalClient == nil {
		return
	}

	settings, err := s.settings.Get(ctx)
	if err != nil {
		log.Warn().Err(err).Msg("gcal sync: failed to get settings")
		return
	}

	event := gcal.ShowToEvent(show, settings.SpaceName, settings.Address, settings.Website)

	if show.GoogleCalEventID != "" {
		_, err = s.gcalClient.UpdateEvent(ctx, show.GoogleCalEventID, event)
		if err != nil {
			log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: update failed")
			return
		}
		log.Info().Int("showId", show.ID).Msg("gcal sync: updated event")
	} else {
		result, err := s.gcalClient.CreateEvent(ctx, event)
		if err != nil {
			log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: create failed")
			return
		}
		// Store the Google Calendar event ID on the show
		_, err = s.shows.UpdateGoogleCalSync(ctx, show.ID, result.EventID, result.SyncedAt)
		if err != nil {
			log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: failed to save event ID")
		}
		log.Info().Int("showId", show.ID).Str("eventId", result.EventID).Msg("gcal sync: created event")
	}
}

// deleteGCalEvent removes a show's event from Google Calendar.
func (s *ShowService) deleteGCalEvent(ctx context.Context, eventID string, showID int) {
	if s.gcalClient == nil {
		return
	}
	if err := s.gcalClient.DeleteEvent(ctx, eventID); err != nil {
		log.Error().Err(err).Int("showId", showID).Str("eventId", eventID).Msg("gcal sync: delete failed")
	} else {
		log.Info().Int("showId", showID).Msg("gcal sync: deleted event")
	}
}
