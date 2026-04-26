package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"google.golang.org/protobuf/encoding/protojson"
)

func (s *Server) handleListAppShows(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	shows, err := s.showService.ListAll(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	pbShows := make([]*pyxisv1.AppShow, len(shows))
	for i, show := range shows {
		pbShows[i] = domainShowToAppShow(&show)
	}

	// Respond with Show proto (frontend can handle both public and staff views)
	pbShows2 := make([]*pyxisv1.Show, len(shows))
	for i, show := range shows {
		pbShows2[i] = showToProto(&show)
	}
	respondProtoJSON(w, http.StatusOK, &pyxisv1.ShowList{Shows: pbShows2})
}

func (s *Server) handleCreateShow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req pyxisv1.Show
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	show := protoToDomainShow(&req)
	actorID := int(user.ID)
	actorName := user.DiscordUsername

	created, err := s.showService.Create(ctx, show, actorID, actorName)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusCreated, showToProto(created))
}

func (s *Server) handleUpdateShow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req pyxisv1.Show
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	show := protoToDomainShow(&req)
	show.ID = id
	actorID := int(user.ID)
	actorName := user.DiscordUsername

	updated, err := s.showService.Update(ctx, show, actorID, actorName)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, showToProto(updated))
}

func (s *Server) handleCancelShow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	actorID := int(user.ID)
	actorName := user.DiscordUsername

	updated, err := s.showService.Cancel(ctx, id, actorID, actorName)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, showToProto(updated))
}

func (s *Server) handleArchiveShow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	actorID := int(user.ID)
	actorName := user.DiscordUsername

	if err := s.showService.Archive(ctx, id, actorID, actorName); err != nil {
		respondError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

func protoToDomainShow(pb *pyxisv1.Show) *domain.Show {
	show := &domain.Show{
		Artist:      pb.Artist,
		DoorsTime:   pb.DoorsTime,
		StartTime:   pb.StartTime,
		Age:         pb.Age,
		Price:       pb.Price,
		Genre:       pb.Genre,
		Description: pb.Description,
		FlyerURL:    pb.FlyerUrl,
		Status:      pb.Status,
	}
	if pb.Date != "" {
		t, _ := time.Parse(time.DateOnly, pb.Date)
		show.Date = t
	}
	if pb.SubmissionId > 0 {
		v := int(pb.SubmissionId)
		show.SubmissionID = &v
	}
	if pb.ArtistId > 0 {
		v := int(pb.ArtistId)
		show.ArtistID = &v
	}
	return show
}

func domainShowToAppShow(show *domain.Show) *pyxisv1.AppShow {
	return &pyxisv1.AppShow{
		Id:     int32(show.ID),
		Artist: show.Artist,
		Date:   show.Date.Format(time.DateOnly),
		Doors:  show.DoorsTime,
		Age:    show.Age,
		Price:  show.Price,
		Status: show.Status,
		Genre:  show.Genre,
	}
}

func (s *Server) handleListBookings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	status := r.URL.Query().Get("status")

	subs, err := s.submissionService.List(ctx, status)
	if err != nil {
		respondError(w, err)
		return
	}

	pbSubs := make([]map[string]interface{}, len(subs))
	for i, sub := range subs {
		pbSubs[i] = submissionToProto(&sub)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"submissions": pbSubs,
	})
}

func (s *Server) handleApproveBooking(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid booking ID: %w", err))
		return
	}

	actorID := int(user.ID)
	actorName := user.DiscordUsername

	created, err := s.submissionService.Approve(ctx, id, actorID, actorName)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, showToProto(created))
}

func (s *Server) handleDeclineBooking(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid booking ID: %w", err))
		return
	}

	actorID := int(user.ID)
	actorName := user.DiscordUsername

	if err := s.submissionService.Decline(ctx, id, actorID, actorName); err != nil {
		respondError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

func (s *Server) handleListArtists(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	artists, err := s.artistService.List(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	pbArtists := make([]map[string]interface{}, len(artists))
	for i, artist := range artists {
		pbArtists[i] = map[string]interface{}{
			"id":        artist.ID,
			"name":      artist.Name,
			"genre":     artist.Genre,
			"links":     artist.Links,
			"notes":     artist.Notes,
			"createdAt": artist.CreatedAt.Format(time.RFC3339),
		}
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"artists": pbArtists,
	})
}

func (s *Server) handleGetArtist(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid artist ID: %w", err))
		return
	}

	artist, err := s.artistService.GetByID(ctx, id)
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":        artist.ID,
		"name":      artist.Name,
		"genre":     artist.Genre,
		"links":     artist.Links,
		"notes":     artist.Notes,
		"createdAt": artist.CreatedAt.Format(time.RFC3339),
	})
}

func (s *Server) handleUpdateArtist(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid artist ID: %w", err))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req struct {
		Name  string `json:"name"`
		Genre string `json:"genre"`
		Links string `json:"links"`
		Notes string `json:"notes"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	artist := &domain.Artist{
		ID:    id,
		Name:  req.Name,
		Genre: req.Genre,
		Links: req.Links,
		Notes: req.Notes,
	}

	updated, err := s.artistService.Update(ctx, artist)
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":        updated.ID,
		"name":      updated.Name,
		"genre":     updated.Genre,
		"links":     updated.Links,
		"notes":     updated.Notes,
		"createdAt": updated.CreatedAt.Format(time.RFC3339),
	})
}

func submissionToProto(sub *domain.Submission) map[string]interface{} {
	pb := map[string]interface{}{
		"id":             sub.ID,
		"artistName":     sub.ArtistName,
		"genre":          sub.Genre,
		"links":          sub.Links,
		"techRider":      sub.TechRider,
		"message":        sub.Message,
		"contactDiscord": sub.ContactDiscord,
		"status":         sub.Status,
		"createdAt":      sub.CreatedAt.Format(time.RFC3339),
	}
	if sub.ArtistID != nil {
		pb["artistId"] = *sub.ArtistID
	}
	if sub.PreferredDate != nil {
		pb["preferredDate"] = sub.PreferredDate.Format(time.DateOnly)
	}
	if sub.ExpectedDraw != nil {
		pb["expectedDraw"] = *sub.ExpectedDraw
	}
	if sub.ReviewedBy != nil {
		pb["reviewedBy"] = *sub.ReviewedBy
	}
	if sub.ReviewedAt != nil {
		pb["reviewedAt"] = sub.ReviewedAt.Format(time.RFC3339)
	}
	return pb
}

func (s *Server) handleListCalendar(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	holds, err := s.calendarService.ListHolds(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	blocked, err := s.calendarService.ListBlocked(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	pbHolds := make([]map[string]interface{}, len(holds))
	for i, h := range holds {
		pbHolds[i] = map[string]interface{}{
			"id":    h.ID,
			"date":  h.Date.Format(time.DateOnly),
			"label": h.Label,
		}
	}

	pbBlocked := make([]map[string]interface{}, len(blocked))
	for i, b := range blocked {
		pbBlocked[i] = map[string]interface{}{
			"id":     b.ID,
			"date":   b.Date.Format(time.DateOnly),
			"reason": b.Reason,
		}
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"holds":   pbHolds,
		"blocked": pbBlocked,
	})
}

func (s *Server) handleCreateCalendarHold(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req struct {
		Date  string `json:"date"`
		Label string `json:"label"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	t, err := time.Parse(time.DateOnly, req.Date)
	if err != nil {
		respondError(w, fmt.Errorf("invalid date: %w", err))
		return
	}

	actorID := int(user.ID)
	created, err := s.calendarService.CreateHold(ctx, &domain.CalendarHold{
		Date:      t,
		Label:     req.Label,
		CreatedBy: &actorID,
	})
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"id":    created.ID,
		"date":  created.Date.Format(time.DateOnly),
		"label": created.Label,
	})
}

func (s *Server) handleDeleteCalendarHold(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid hold ID: %w", err))
		return
	}

	if err := s.calendarService.DeleteHold(ctx, id); err != nil {
		respondError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleCreateCalendarBlocked(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req struct {
		Date   string `json:"date"`
		Reason string `json:"reason"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	t, err := time.Parse(time.DateOnly, req.Date)
	if err != nil {
		respondError(w, fmt.Errorf("invalid date: %w", err))
		return
	}

	actorID := int(user.ID)
	created, err := s.calendarService.CreateBlocked(ctx, &domain.CalendarBlocked{
		Date:      t,
		Reason:    req.Reason,
		CreatedBy: &actorID,
	})
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"id":     created.ID,
		"date":   created.Date.Format(time.DateOnly),
		"reason": created.Reason,
	})
}

func (s *Server) handleDeleteCalendarBlocked(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid blocked ID: %w", err))
		return
	}

	if err := s.calendarService.DeleteBlocked(ctx, id); err != nil {
		respondError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleListAttendance(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	limit := 50
	offset := 0
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
		}
	}

	logs, err := s.attendanceService.List(ctx, limit, offset)
	if err != nil {
		respondError(w, err)
		return
	}

	pbLogs := make([]map[string]interface{}, len(logs))
	for i, log := range logs {
		pbLogs[i] = map[string]interface{}{
			"id":            log.ID,
			"showId":        log.ShowID,
			"artist":        log.Artist,
			"date":          log.Date.Format(time.DateOnly),
			"draw":          log.Draw,
			"notes":         log.Notes,
			"incident":      log.Incident,
			"incidentNotes": log.IncidentNotes,
			"createdAt":     log.CreatedAt.Format(time.RFC3339),
		}
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"logs": pbLogs,
	})
}

func (s *Server) handleGetAttendance(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	showIDStr := r.PathValue("showId")
	showID, err := strconv.Atoi(showIDStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	log, err := s.attendanceService.GetByShowID(ctx, showID)
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":            log.ID,
		"showId":        log.ShowID,
		"draw":          log.Draw,
		"notes":         log.Notes,
		"incident":      log.Incident,
		"incidentNotes": log.IncidentNotes,
		"createdAt":     log.CreatedAt.Format(time.RFC3339),
	})
}

func (s *Server) handleUpsertAttendance(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	showIDStr := r.PathValue("showId")
	showID, err := strconv.Atoi(showIDStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req struct {
		Draw          *int   `json:"draw"`
		Notes         string `json:"notes"`
		Incident      bool   `json:"incident"`
		IncidentNotes string `json:"incidentNotes"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	actorID := int(user.ID)
	updated, err := s.attendanceService.Upsert(ctx, &domain.AttendanceLog{
		ShowID:        showID,
		Draw:          req.Draw,
		Notes:         req.Notes,
		Incident:      req.Incident,
		IncidentNotes: req.IncidentNotes,
		LoggedBy:      &actorID,
	})
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":            updated.ID,
		"showId":        updated.ShowID,
		"draw":          updated.Draw,
		"notes":         updated.Notes,
		"incident":      updated.Incident,
		"incidentNotes": updated.IncidentNotes,
		"createdAt":     updated.CreatedAt.Format(time.RFC3339),
	})
}

func (s *Server) handleGetSettings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	settings, err := s.settingsService.Get(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":                     settings.ID,
		"spaceName":              settings.SpaceName,
		"tagline":                settings.Tagline,
		"address":                settings.Address,
		"capacity":               settings.Capacity,
		"contactEmail":           settings.ContactEmail,
		"website":                settings.Website,
		"discordGuildId":         settings.DiscordGuildID,
		"discordChUpcoming":      settings.DiscordChUpcoming,
		"discordChAnnouncements": settings.DiscordChAnnouncements,
		"discordChStaff":         settings.DiscordChStaff,
		"discordChBookings":      settings.DiscordChBookings,
		"setupComplete":          settings.SetupComplete,
		"updatedAt":              settings.UpdatedAt.Format(time.RFC3339),
	})
}

func (s *Server) handleUpdateSettings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req struct {
		SpaceName              string `json:"spaceName"`
		Tagline                string `json:"tagline"`
		Address                string `json:"address"`
		Capacity               *int   `json:"capacity"`
		ContactEmail           string `json:"contactEmail"`
		Website                string `json:"website"`
		DiscordGuildID         string `json:"discordGuildId"`
		DiscordChUpcoming      string `json:"discordChUpcoming"`
		DiscordChAnnouncements string `json:"discordChAnnouncements"`
		DiscordChStaff         string `json:"discordChStaff"`
		DiscordChBookings      string `json:"discordChBookings"`
		SetupComplete          bool   `json:"setupComplete"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	updated, err := s.settingsService.Update(ctx, &domain.Settings{
		SpaceName:              req.SpaceName,
		Tagline:                req.Tagline,
		Address:                req.Address,
		Capacity:               req.Capacity,
		ContactEmail:           req.ContactEmail,
		Website:                req.Website,
		DiscordGuildID:         req.DiscordGuildID,
		DiscordChUpcoming:      req.DiscordChUpcoming,
		DiscordChAnnouncements: req.DiscordChAnnouncements,
		DiscordChStaff:         req.DiscordChStaff,
		DiscordChBookings:      req.DiscordChBookings,
		SetupComplete:          req.SetupComplete,
	})
	if err != nil {
		respondError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":                     updated.ID,
		"spaceName":              updated.SpaceName,
		"tagline":                updated.Tagline,
		"address":                updated.Address,
		"capacity":               updated.Capacity,
		"contactEmail":           updated.ContactEmail,
		"website":                updated.Website,
		"discordGuildId":         updated.DiscordGuildID,
		"discordChAnnouncements": updated.DiscordChAnnouncements,
		"discordChStaff":         updated.DiscordChStaff,
		"discordChBookings":      updated.DiscordChBookings,
		"setupComplete":          updated.SetupComplete,
		"updatedAt":              updated.UpdatedAt.Format(time.RFC3339),
	})
}

func (s *Server) handleListAuditLog(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	limit := 50
	offset := 0
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
		}
	}

	entries, err := s.auditService.List(ctx, limit, offset)
	if err != nil {
		respondError(w, err)
		return
	}

	pbEntries := make([]map[string]interface{}, len(entries))
	for i, entry := range entries {
		pbEntries[i] = map[string]interface{}{
			"id":         entry.ID,
			"actor":      entry.Actor,
			"action":     entry.Action,
			"entityType": entry.EntityType,
			"metadata":   entry.Metadata,
			"createdAt":  entry.CreatedAt.Format(time.RFC3339),
		}
		if entry.ActorID != nil {
			pbEntries[i]["actorId"] = *entry.ActorID
		}
		if entry.EntityID != nil {
			pbEntries[i]["entityId"] = *entry.EntityID
		}
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"entries": pbEntries,
	})
}

func (s *Server) requireRole(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := s.userFromContext(r.Context())
			if user == nil {
				respondError(w, fmt.Errorf("unauthenticated"))
				return
			}
			for _, role := range roles {
				if user.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}
			respondError(w, fmt.Errorf("forbidden"))
		})
	}
}
