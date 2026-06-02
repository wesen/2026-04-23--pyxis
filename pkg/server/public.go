package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/gcal"
	"github.com/go-go-golems/pyxis/pkg/service"
	"github.com/rs/zerolog/log"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func (s *Server) handleCreateSubmission(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req pyxisv1.BookingFormData
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	sub := &domain.Submission{
		ArtistName: req.ArtistName,
		Genre:      req.Genre,
		Links:      req.Links,
		TechRider:  req.TechRider,
		Message:    req.Message,
	}
	if req.PreferredDate != "" {
		t, err := time.Parse(time.DateOnly, req.PreferredDate)
		if err == nil {
			sub.PreferredDate = &t
		}
	}
	if req.ExpectedDraw > 0 {
		v := int(req.ExpectedDraw)
		sub.ExpectedDraw = &v
	}

	created, err := s.submissionService.Create(ctx, sub)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusCreated, &pyxisv1.BookingConfirmation{
		Success:      true,
		SubmissionId: int32(created.ID),
	})
}

func (s *Server) handleGetPublicSettings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	settings, err := s.settingsService.Get(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, settingsToProto(s.settingsWithRuntimeConfig(settings)))
}

func (s *Server) handleListPublicShows(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	shows, err := s.showService.ListUpcoming(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	pbShows := make([]*pyxisv1.Show, len(shows))
	for i, show := range shows {
		pbShows[i] = showToProto(&show)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.ShowList{Shows: pbShows})
}

func (s *Server) handleGetPublicShow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("%w: invalid show ID", service.ErrValidation))
		return
	}

	show, err := s.showService.GetPublicByID(ctx, id)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, showToProto(show))
}

func (s *Server) handleGetArchive(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	search := strings.TrimSpace(r.URL.Query().Get("search"))

	shows, err := s.showService.SearchArchive(ctx, search)
	if err != nil {
		respondError(w, err)
		return
	}

	pbShows := make([]*pyxisv1.ArchivedShow, len(shows))
	for i, show := range shows {
		pbShows[i] = archivedShowToProto(&show)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.ArchivedShowList{Shows: pbShows})
}

func (s *Server) handleGetArchiveStats(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	stats, err := s.showService.GetArchiveStats(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.ArchiveStats{
		TotalShows:      int32(stats.TotalShows),
		TotalAttendance: int32(stats.TotalAttendance),
		YearsRunning:    int32(stats.YearsRunning),
		UniqueArtists:   int32(stats.UniqueArtists),
	})
}

func showStatusFromString(s string) pyxisv1.ShowStatus {
	switch s {
	case "confirmed":
		return pyxisv1.ShowStatus_SHOW_STATUS_CONFIRMED
	case "cancelled":
		return pyxisv1.ShowStatus_SHOW_STATUS_CANCELLED
	case "archived":
		return pyxisv1.ShowStatus_SHOW_STATUS_ARCHIVED
	case "draft":
		return pyxisv1.ShowStatus_SHOW_STATUS_DRAFT
	case "hold":
		return pyxisv1.ShowStatus_SHOW_STATUS_HOLD
	case "blocked":
		return pyxisv1.ShowStatus_SHOW_STATUS_BLOCKED
	}
	return pyxisv1.ShowStatus_SHOW_STATUS_UNSPECIFIED
}

func submissionStatusFromString(s string) pyxisv1.SubmissionStatus {
	switch s {
	case "pending":
		return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_PENDING
	case "approved":
		return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_APPROVED
	case "declined":
		return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_DECLINED
	case "hold":
		return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_HOLD
	case "cancelled":
		return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_CANCELLED
	}
	return pyxisv1.SubmissionStatus_SUBMISSION_STATUS_UNSPECIFIED
}

func showToProto(show *domain.Show) *pyxisv1.Show {
	pb := &pyxisv1.Show{
		Id:                   int32(show.ID),
		Artist:               show.Artist,
		Date:                 show.Date.Format(time.DateOnly),
		DoorsTime:            show.DoorsTime,
		StartTime:            show.StartTime,
		Age:                  show.Age,
		Price:                show.Price,
		Genre:                show.Genre,
		Description:          show.Description,
		Notes:                show.Notes,
		FlyerUrl:             show.FlyerURL,
		DiscordMessageId:     show.DiscordMessageID,
		DiscordChannelId:     show.DiscordChannelID,
		ReserveTicketEnabled: show.ReserveTicketEnabled,
		Draw:                 int32(show.Draw),
		Capacity:             int32(show.Capacity),
		Status:               showStatusFromString(show.Status),
		CreatedAt:            show.CreatedAt.Format(time.RFC3339),
		UpdatedAt:            show.UpdatedAt.Format(time.RFC3339),
	}
	if show.SubmissionID != nil {
		pb.SubmissionId = int32(*show.SubmissionID)
	}
	if show.ArtistID != nil {
		pb.ArtistId = int32(*show.ArtistID)
	}
	for _, entry := range show.Lineup {
		pb.Lineup = append(pb.Lineup, &pyxisv1.Show_LineupEntry{
			Artist:    entry.Artist,
			Role:      entry.Role,
			StartTime: entry.StartTime,
			EndTime:   entry.EndTime,
		})
	}
	// Google Calendar sync status
	pb.GoogleCalEventId = show.GoogleCalEventID
	if show.GoogleCalSyncedAt != nil {
		pb.GoogleCalSyncedAt = show.GoogleCalSyncedAt.Format(time.RFC3339)
	}
	return pb
}

func archivedShowToProto(show *domain.ArchivedShow) *pyxisv1.ArchivedShow {
	return &pyxisv1.ArchivedShow{
		Id:     int32(show.ID),
		Artist: show.Artist,
		Date:   show.Date.Format(time.DateOnly),
		Genre:  show.Genre,
		Draw:   int32(show.Draw),
	}
}

func artistToProto(artist *domain.Artist) *pyxisv1.Artist {
	return &pyxisv1.Artist{
		Id:        int32(artist.ID),
		Name:      artist.Name,
		Genre:     artist.Genre,
		Links:     artist.Links,
		Notes:     artist.Notes,
		CreatedAt: artist.CreatedAt.Format(time.RFC3339),
		UpdatedAt: artist.UpdatedAt.Format(time.RFC3339),
	}
}

func submissionToProto(sub *domain.Submission) *pyxisv1.Submission {
	pb := &pyxisv1.Submission{
		Id:             int32(sub.ID),
		ArtistName:     sub.ArtistName,
		Genre:          sub.Genre,
		Links:          sub.Links,
		TechRider:      sub.TechRider,
		Message:        sub.Message,
		ContactDiscord: sub.ContactDiscord,
		Status:         submissionStatusFromString(sub.Status),
		CreatedAt:      sub.CreatedAt.Format(time.RFC3339),
	}
	if sub.ArtistID != nil {
		pb.ArtistId = int32(*sub.ArtistID)
	}
	if sub.PreferredDate != nil {
		pb.PreferredDate = sub.PreferredDate.Format(time.DateOnly)
	}
	if sub.ExpectedDraw != nil {
		pb.ExpectedDraw = int32(*sub.ExpectedDraw)
	}
	if sub.ReviewedBy != nil {
		pb.ReviewedBy = int32(*sub.ReviewedBy)
	}
	if sub.ReviewedAt != nil {
		pb.ReviewedAt = sub.ReviewedAt.Format(time.RFC3339)
	}
	return pb
}

func bookingReviewToProto(review *domain.BookingReview) *pyxisv1.BookingReview {
	pb := &pyxisv1.BookingReview{
		SubmissionId: int32(review.SubmissionID),
		Note:         review.Note,
		Decision:     review.Decision,
		UpdatedAt:    review.UpdatedAt.Format(time.RFC3339),
	}
	if review.UpdatedBy != nil {
		pb.UpdatedBy = int32(*review.UpdatedBy)
	}
	return pb
}

func calendarHoldToProto(h *domain.CalendarHold) *pyxisv1.CalendarHold {
	return &pyxisv1.CalendarHold{
		Id:    int32(h.ID),
		Date:  h.Date.Format(time.DateOnly),
		Label: h.Label,
	}
}

func calendarBlockedToProto(b *domain.CalendarBlocked) *pyxisv1.CalendarBlocked {
	return &pyxisv1.CalendarBlocked{
		Id:     int32(b.ID),
		Date:   b.Date.Format(time.DateOnly),
		Reason: b.Reason,
	}
}

func showToCalendarEvent(show *domain.Show) *pyxisv1.CalendarEvent {
	return &pyxisv1.CalendarEvent{
		Id:     int32(show.ID),
		Date:   show.Date.Format(time.DateOnly),
		Label:  show.Artist,
		Status: showStatusFromString(show.Status),
		Kind:   pyxisv1.CalendarEventKind_CALENDAR_EVENT_KIND_SHOW,
	}
}

func calendarHoldToEvent(h *domain.CalendarHold) *pyxisv1.CalendarEvent {
	return &pyxisv1.CalendarEvent{
		Id:     int32(h.ID),
		Date:   h.Date.Format(time.DateOnly),
		Label:  h.Label,
		Status: pyxisv1.ShowStatus_SHOW_STATUS_HOLD,
		Kind:   pyxisv1.CalendarEventKind_CALENDAR_EVENT_KIND_HOLD,
	}
}

func calendarBlockedToEvent(b *domain.CalendarBlocked) *pyxisv1.CalendarEvent {
	return &pyxisv1.CalendarEvent{
		Id:     int32(b.ID),
		Date:   b.Date.Format(time.DateOnly),
		Label:  b.Reason,
		Status: pyxisv1.ShowStatus_SHOW_STATUS_BLOCKED,
		Kind:   pyxisv1.CalendarEventKind_CALENDAR_EVENT_KIND_BLOCKED,
	}
}

func auditLogEntryToProto(entry *domain.AuditLogEntry) *pyxisv1.AuditLogEntry {
	pb := &pyxisv1.AuditLogEntry{
		Id:         int32(entry.ID),
		Actor:      entry.Actor,
		Action:     entry.Action,
		EntityType: entry.EntityType,
		CreatedAt:  entry.CreatedAt.Format(time.RFC3339),
	}
	if entry.ActorID != nil {
		pb.ActorId = int32(*entry.ActorID)
	}
	if entry.EntityID != nil {
		pb.EntityId = int32(*entry.EntityID)
	}
	if entry.Metadata != nil {
		b, _ := json.Marshal(entry.Metadata)
		pb.Metadata = string(b)
	}
	return pb
}

func settingsToProto(settings *domain.Settings) *pyxisv1.Settings {
	pb := &pyxisv1.Settings{
		Id:                     int32(settings.ID),
		SpaceName:              settings.SpaceName,
		Tagline:                settings.Tagline,
		Address:                settings.Address,
		ContactEmail:           settings.ContactEmail,
		BookingEmail:           settings.BookingEmail,
		Website:                settings.Website,
		DiscordGuildId:         settings.DiscordGuildID,
		DiscordChUpcoming:      settings.DiscordChUpcoming,
		DiscordChAnnouncements: settings.DiscordChAnnouncements,
		DiscordChStaff:         settings.DiscordChStaff,
		DiscordChBookings:      settings.DiscordChBookings,
		SetupComplete:          settings.SetupComplete,
		Timezone:               settings.Timezone,
		AutoArchive:            settings.AutoArchive,
		DiscordPosting:         settings.DiscordPosting,
		SafeSpaceRequired:      settings.SafeSpaceRequired,
		UpdatedAt:              settings.UpdatedAt.Format(time.RFC3339),
	}
	if settings.Capacity != nil {
		pb.Capacity = int32(*settings.Capacity)
	}
	// Google Calendar integration
	pb.GoogleCalEnabled = settings.GoogleCalEnabled
	pb.GoogleCalId = settings.GoogleCalID
	if len(settings.ExternalCalendars) > 0 {
		extJSON, _ := json.Marshal(settings.ExternalCalendars)
		pb.ExternalCalendarsJson = string(extJSON)
	}
	return pb
}

func respondProtoJSON(w http.ResponseWriter, status int, msg proto.Message) {
	b, err := protojson.Marshal(msg)
	if err != nil {
		respondError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(b)
}

func respondJSON(w http.ResponseWriter, status int, v interface{}) {
	b, err := json.Marshal(v)
	if err != nil {
		respondError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(b)
}

// cachedExternalEvents provides in-memory caching for external Google Calendar events.
type cachedExternalEvents struct {
	mu      sync.RWMutex
	entries map[string]cachedExternalEventsEntry
	ttl     time.Duration
}

type cachedExternalEventsEntry struct {
	events  []gcal.ExternalEvent
	fetched time.Time
}

func externalEventsCacheKey(from, to time.Time) string {
	return from.Format(time.DateOnly) + ":" + to.Format(time.DateOnly)
}

func (c *cachedExternalEvents) Get(key string) ([]gcal.ExternalEvent, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	entry, ok := c.entries[key]
	if !ok || time.Since(entry.fetched) > c.ttl {
		return nil, false
	}
	return entry.events, true
}

func (c *cachedExternalEvents) Set(key string, events []gcal.ExternalEvent) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.entries == nil {
		c.entries = map[string]cachedExternalEventsEntry{}
	}
	c.entries[key] = cachedExternalEventsEntry{events: events, fetched: time.Now()}
}

func (s *Server) handleListExternalEvents(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	if s.gcalClient == nil {
		respondProtoJSON(w, http.StatusOK, &pyxisv1.ExternalEventList{})
		return
	}

	// Parse date range
	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")

	from := time.Now().Truncate(24 * time.Hour)
	to := from.Add(30 * 24 * time.Hour)

	if fromStr != "" {
		if t, err := time.Parse("2006-01-02", fromStr); err == nil {
			from = t
		}
	}
	if toStr != "" {
		if t, err := time.Parse("2006-01-02", toStr); err == nil {
			to = t
		}
	}

	// Cap date range to 90 days
	if to.Sub(from) > 90*24*time.Hour {
		to = from.Add(90 * 24 * time.Hour)
	}

	cacheKey := externalEventsCacheKey(from, to)
	if s.externalEventsCache != nil {
		if cached, ok := s.externalEventsCache.Get(cacheKey); ok {
			pbCached := make([]*pyxisv1.ExternalEvent, len(cached))
			for i, e := range cached {
				pbCached[i] = externalEventToProto(&e)
			}
			respondProtoJSON(w, http.StatusOK, &pyxisv1.ExternalEventList{Events: pbCached})
			return
		}
	}

	// Get settings with external calendar config
	settings, err := s.settingsService.Get(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	if len(settings.ExternalCalendars) == 0 {
		respondProtoJSON(w, http.StatusOK, &pyxisv1.ExternalEventList{})
		return
	}

	// Fetch events from each enabled external calendar
	var allEvents []gcal.ExternalEvent
	for _, cal := range settings.ExternalCalendars {
		if !cal.Enabled {
			continue
		}
		events, err := s.gcalClient.ListExternalEvents(ctx, cal.ID, from, to)
		if err != nil {
			log.Warn().Err(err).Str("calendar", cal.ID).Msg("failed to fetch external calendar")
			continue // skip this calendar, don't fail the whole request
		}
		for i := range events {
			events[i].CalendarName = cal.Name
		}
		allEvents = append(allEvents, events...)
	}

	// Sort by start time
	sort.Slice(allEvents, func(i, j int) bool {
		return allEvents[i].Start.Before(allEvents[j].Start)
	})

	// Update cache
	if s.externalEventsCache != nil {
		s.externalEventsCache.Set(cacheKey, allEvents)
	}

	// Convert to proto and respond
	pbEvents := make([]*pyxisv1.ExternalEvent, len(allEvents))
	for i, e := range allEvents {
		pbEvents[i] = externalEventToProto(&e)
	}
	respondProtoJSON(w, http.StatusOK, &pyxisv1.ExternalEventList{Events: pbEvents})
}

func externalEventToProto(e *gcal.ExternalEvent) *pyxisv1.ExternalEvent {
	start := e.Start.Format(time.RFC3339)
	end := e.End.Format(time.RFC3339)
	if e.IsAllDay {
		if e.StartDate != "" {
			start = e.StartDate
		}
		if e.EndDate != "" {
			end = e.EndDate
		}
	}

	return &pyxisv1.ExternalEvent{
		Id:           e.ID,
		CalendarId:   e.CalendarID,
		CalendarName: e.CalendarName,
		Summary:      e.Summary,
		Description:  e.Description,
		Location:     e.Location,
		Start:        start,
		End:          end,
		Url:          e.URL,
		IsAllDay:     e.IsAllDay,
	}
}

func respondError(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	code := "INTERNAL_ERROR"
	message := err.Error()

	switch {
	case errors.Is(err, service.ErrValidation):
		status = http.StatusBadRequest
		code = "VALIDATION_ERROR"
	case errors.Is(err, service.ErrNotFound):
		status = http.StatusNotFound
		code = "NOT_FOUND"
	case message == "no rows in result set":
		status = http.StatusNotFound
		code = "NOT_FOUND"
	case message == "not found":
		status = http.StatusNotFound
		code = "NOT_FOUND"
	case message == "unauthenticated":
		status = http.StatusUnauthorized
		code = "UNAUTHENTICATED"
	case message == "forbidden":
		status = http.StatusForbidden
		code = "FORBIDDEN"
	}

	b, _ := protojson.Marshal(&pyxisv1.ErrorResponse{
		Error: &pyxisv1.ErrorResponse_Error{
			Code:    code,
			Message: message,
		},
	})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(b)
}
