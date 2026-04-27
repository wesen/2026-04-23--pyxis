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

func (s *Server) handleGetAppShow(w http.ResponseWriter, r *http.Request) {
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

	respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
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
		Notes:       pb.Notes,
		FlyerURL:    pb.FlyerUrl,
		Draw:        int(pb.Draw),
		Capacity:    int(pb.Capacity),
		Status:      showStatusToString(pb.Status),
	}
	for _, entry := range pb.Lineup {
		show.Lineup = append(show.Lineup, domain.LineupEntry{
			Artist:    entry.Artist,
			Role:      entry.Role,
			StartTime: entry.StartTime,
			EndTime:   entry.EndTime,
		})
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

func showStatusToString(status pyxisv1.ShowStatus) string {
	switch status {
	case pyxisv1.ShowStatus_SHOW_STATUS_CONFIRMED:
		return domain.StatusConfirmed
	case pyxisv1.ShowStatus_SHOW_STATUS_CANCELLED:
		return domain.StatusCancelled
	case pyxisv1.ShowStatus_SHOW_STATUS_ARCHIVED:
		return domain.StatusArchived
	case pyxisv1.ShowStatus_SHOW_STATUS_DRAFT:
		return domain.StatusDraft
	case pyxisv1.ShowStatus_SHOW_STATUS_HOLD:
		return domain.StatusHold
	case pyxisv1.ShowStatus_SHOW_STATUS_BLOCKED:
		return domain.StatusBlocked
	default:
		return domain.StatusDraft
	}
}

func domainShowToAppShow(show *domain.Show) *pyxisv1.AppShow {
	return &pyxisv1.AppShow{
		Id:     int32(show.ID),
		Artist: show.Artist,
		Date:   show.Date.Format(time.DateOnly),
		Doors:  show.DoorsTime,
		Age:    show.Age,
		Price:  show.Price,
		Status: showStatusFromString(show.Status),
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

	pbSubs := make([]*pyxisv1.Submission, len(subs))
	for i, sub := range subs {
		pbSubs[i] = submissionToProto(&sub)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.SubmissionList{Submissions: pbSubs})
}

func protoToDomainSubmission(pb *pyxisv1.Submission) *domain.Submission {
	sub := &domain.Submission{
		ID:             int(pb.Id),
		ArtistName:     pb.ArtistName,
		Genre:          pb.Genre,
		Links:          pb.Links,
		TechRider:      pb.TechRider,
		Message:        pb.Message,
		ContactDiscord: pb.ContactDiscord,
	}
	if pb.ArtistId > 0 {
		v := int(pb.ArtistId)
		sub.ArtistID = &v
	}
	if pb.PreferredDate != "" {
		if t, err := time.Parse(time.DateOnly, pb.PreferredDate); err == nil {
			sub.PreferredDate = &t
		}
	}
	if pb.ExpectedDraw > 0 {
		v := int(pb.ExpectedDraw)
		sub.ExpectedDraw = &v
	}
	return sub
}

func (s *Server) handleUpdateBooking(w http.ResponseWriter, r *http.Request) {
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req pyxisv1.Submission
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	sub := protoToDomainSubmission(&req)
	sub.ID = id
	actorID := int(user.ID)
	updated, err := s.submissionService.UpdateDetails(ctx, sub, actorID, user.DiscordUsername)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, submissionToProto(updated))
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

func (s *Server) handleGetBookingReview(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid booking ID: %w", err))
		return
	}

	review, err := s.submissionService.GetReview(ctx, id)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, bookingReviewToProto(review))
}

func (s *Server) handleUpdateBookingReview(w http.ResponseWriter, r *http.Request) {
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondError(w, fmt.Errorf("read body: %w", err))
		return
	}

	var req pyxisv1.BookingReview
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	actorID := int(user.ID)
	updated, err := s.submissionService.UpsertReview(ctx, &domain.BookingReview{
		SubmissionID: id,
		Note:         req.Note,
		Decision:     req.Decision,
		UpdatedBy:    &actorID,
	}, actorID, user.DiscordUsername)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, bookingReviewToProto(updated))
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

	respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
}

func (s *Server) handleListArtists(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	artists, err := s.artistService.List(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	pbArtists := make([]*pyxisv1.Artist, len(artists))
	for i, artist := range artists {
		pbArtists[i] = artistToProto(&artist)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.ArtistList{Artists: pbArtists})
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

	respondProtoJSON(w, http.StatusOK, artistToProto(artist))
}

func protoToDomainArtist(pb *pyxisv1.Artist) *domain.Artist {
	return &domain.Artist{
		ID:    int(pb.Id),
		Name:  pb.Name,
		Genre: pb.Genre,
		Links: pb.Links,
		Notes: pb.Notes,
	}
}

func (s *Server) handleCreateArtist(w http.ResponseWriter, r *http.Request) {
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

	var req pyxisv1.Artist
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	created, err := s.artistService.Create(ctx, protoToDomainArtist(&req))
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusCreated, artistToProto(created))
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

	var req pyxisv1.Artist
	if err := protojson.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}

	artist := protoToDomainArtist(&req)
	artist.ID = id

	updated, err := s.artistService.Update(ctx, artist)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, artistToProto(updated))
}

func (s *Server) handleAnnounceShow(w http.ResponseWriter, r *http.Request) {
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

	if err := s.showService.Announce(ctx, id, actorID, actorName); err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
}

func (s *Server) handleUploadFlyer(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	showID, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		respondError(w, fmt.Errorf("parse form: %w", err))
		return
	}

	file, header, err := r.FormFile("flyer")
	if err != nil {
		respondError(w, fmt.Errorf("get file: %w", err))
		return
	}
	defer file.Close()

	url, err := s.flyerStore.Upload(ctx, showID, header.Filename, file)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.FlyerUploadResponse{Url: url})
}

func (s *Server) handleDeleteFlyer(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	idStr := r.PathValue("id")
	showID, err := strconv.Atoi(idStr)
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}

	filename := r.URL.Query().Get("filename")
	if filename == "" {
		respondError(w, fmt.Errorf("filename required"))
		return
	}

	if err := s.flyerStore.Delete(ctx, showID, filename); err != nil {
		respondError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleListCalendar(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	shows, err := s.showService.ListAll(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

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

	events := make([]*pyxisv1.CalendarEvent, 0, len(shows)+len(holds)+len(blocked))
	for i := range shows {
		if shows[i].Status == domain.StatusConfirmed {
			events = append(events, showToCalendarEvent(&shows[i]))
		}
	}
	for i := range holds {
		events = append(events, calendarHoldToEvent(&holds[i]))
	}
	for i := range blocked {
		events = append(events, calendarBlockedToEvent(&blocked[i]))
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.CalendarEventList{Events: events})
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

	respondProtoJSON(w, http.StatusCreated, calendarHoldToProto(created))
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

	respondProtoJSON(w, http.StatusCreated, calendarBlockedToProto(created))
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

	pbLogs := make([]*pyxisv1.AttendanceLog, len(logs))
	for i, log := range logs {
		pbLogs[i] = attendanceLogToProto(&log)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.AttendanceLogList{Logs: pbLogs})
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

	respondProtoJSON(w, http.StatusOK, attendanceLogToProto(log))
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

	respondProtoJSON(w, http.StatusOK, attendanceLogToProto(updated))
}

func (s *Server) handleGetSettings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	settings, err := s.settingsService.Get(ctx)
	if err != nil {
		respondError(w, err)
		return
	}

	respondProtoJSON(w, http.StatusOK, settingsToProto(settings))
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

	respondProtoJSON(w, http.StatusOK, settingsToProto(updated))
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

	pbEntries := make([]*pyxisv1.AuditLogEntry, len(entries))
	for i, entry := range entries {
		pbEntries[i] = auditLogEntryToProto(&entry)
	}

	respondProtoJSON(w, http.StatusOK, &pyxisv1.AuditLogEntryList{Entries: pbEntries})
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
