package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/service"
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
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	show, err := s.showService.GetByID(ctx, id)
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
		Id:          int32(show.ID),
		Artist:      show.Artist,
		Date:        show.Date.Format(time.DateOnly),
		DoorsTime:   show.DoorsTime,
		StartTime:   show.StartTime,
		Age:         show.Age,
		Price:       show.Price,
		Genre:       show.Genre,
		Description: show.Description,
		Notes:       show.Notes,
		FlyerUrl:    show.FlyerURL,
		Draw:        int32(show.Draw),
		Capacity:    int32(show.Capacity),
		Status:      showStatusFromString(show.Status),
		CreatedAt:   show.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   show.UpdatedAt.Format(time.RFC3339),
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
		Id:          int32(sub.ID),
		ArtistName:  sub.ArtistName,
		Genre:       sub.Genre,
		Links:       sub.Links,
		TechRider:   sub.TechRider,
		Message:     sub.Message,
		Status:      submissionStatusFromString(sub.Status),
		CreatedAt:   sub.CreatedAt.Format(time.RFC3339),
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

func attendanceLogToProto(log *domain.AttendanceLog) *pyxisv1.AttendanceLog {
	pb := &pyxisv1.AttendanceLog{
		Id:            int32(log.ID),
		ShowId:        int32(log.ShowID),
		Artist:        log.Artist,
		Date:          log.Date.Format(time.DateOnly),
		Notes:         log.Notes,
		Incident:      log.Incident,
		IncidentNotes: log.IncidentNotes,
		CreatedAt:     log.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     log.UpdatedAt.Format(time.RFC3339),
	}
	if log.Draw != nil {
		pb.Draw = int32(*log.Draw)
	}
	if log.LoggedBy != nil {
		pb.LoggedBy = int32(*log.LoggedBy)
	}
	return pb
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
	w.Write(b)
}

func respondJSON(w http.ResponseWriter, status int, v interface{}) {
	b, err := json.Marshal(v)
	if err != nil {
		respondError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(b)
}

func respondError(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	code := "INTERNAL_ERROR"
	message := err.Error()

	switch {
	case errors.Is(err, service.ErrNotFound):
		status = http.StatusNotFound
		code = "NOT_FOUND"
	case message == "no rows in result set":
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
	w.Write(b)
}
