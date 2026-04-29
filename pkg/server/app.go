package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/service"
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
		Artist:           pb.Artist,
		DoorsTime:        pb.DoorsTime,
		StartTime:        pb.StartTime,
		Age:              pb.Age,
		Price:            pb.Price,
		Genre:            pb.Genre,
		Description:      pb.Description,
		Notes:            pb.Notes,
		FlyerURL:         pb.FlyerUrl,
		DiscordMessageID: pb.DiscordMessageId,
		DiscordChannelID: pb.DiscordChannelId,
		Draw:             int(pb.Draw),
		Capacity:         int(pb.Capacity),
		Status:           showStatusToString(pb.Status),
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

func submissionStatusToString(status pyxisv1.SubmissionStatus) string {
	switch status {
	case pyxisv1.SubmissionStatus_SUBMISSION_STATUS_PENDING:
		return "pending"
	case pyxisv1.SubmissionStatus_SUBMISSION_STATUS_APPROVED:
		return "approved"
	case pyxisv1.SubmissionStatus_SUBMISSION_STATUS_DECLINED:
		return "declined"
	case pyxisv1.SubmissionStatus_SUBMISSION_STATUS_HOLD:
		return "hold"
	case pyxisv1.SubmissionStatus_SUBMISSION_STATUS_CANCELLED:
		return "cancelled"
	default:
		return ""
	}
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
		Id:               int32(show.ID),
		Artist:           show.Artist,
		Date:             show.Date.Format(time.DateOnly),
		Doors:            show.DoorsTime,
		Age:              show.Age,
		Price:            show.Price,
		Status:           showStatusFromString(show.Status),
		Genre:            show.Genre,
		Pinned:           show.DiscordMessageID != "",
		Notes:            show.Notes,
		DiscordMessageId: show.DiscordMessageID,
		DiscordChannelId: show.DiscordChannelID,
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
		Status:         submissionStatusToString(pb.Status),
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

	show, err := s.showService.GetByID(ctx, showID)
	if err != nil {
		respondError(w, err)
		return
	}
	show.FlyerURL = url
	if _, err := s.showService.Update(ctx, show, int(user.ID), user.DiscordUsername); err != nil {
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

	if err := s.flyerStore.Delete(ctx, showID, filename); err != nil && !errors.Is(err, os.ErrNotExist) {
		respondError(w, err)
		return
	}

	show, err := s.showService.GetByID(ctx, showID)
	if err != nil {
		respondError(w, err)
		return
	}
	show.FlyerURL = ""
	if _, err := s.showService.Update(ctx, show, int(user.ID), user.DiscordUsername); err != nil {
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

type showLogEntryResponse struct {
	ShowID          int    `json:"showId"`
	AttendanceLogID *int   `json:"attendanceLogId,omitempty"`
	Artist          string `json:"artist"`
	Date            string `json:"date"`
	Genre           string `json:"genre,omitempty"`
	ShowStatus      string `json:"showStatus"`
	ShowNotes       string `json:"showNotes,omitempty"`
	Draw            *int   `json:"draw,omitempty"`
	PostShowNotes   string `json:"postShowNotes,omitempty"`
	QuickHighlight  string `json:"quickHighlight,omitempty"`
	TotalDoorCents  *int   `json:"totalDoorCents,omitempty"`
	Incident        bool   `json:"incident"`
	IncidentNotes   string `json:"incidentNotes,omitempty"`
	LoggedBy        *int   `json:"loggedBy,omitempty"`
	LoggedByName    string `json:"loggedByName,omitempty"`
	LoggedAt        string `json:"loggedAt,omitempty"`
	UpdatedAt       string `json:"updatedAt,omitempty"`
	LogStatus       string `json:"logStatus"`
}

type showLogListResponse struct {
	Entries []showLogEntryResponse `json:"entries"`
}

func buildShowLogEntry(show *domain.Show, log *domain.AttendanceLog) showLogEntryResponse {
	entry := showLogEntryResponse{
		ShowID:     show.ID,
		Artist:     show.Artist,
		Date:       show.Date.Format(time.DateOnly),
		Genre:      show.Genre,
		ShowStatus: show.Status,
		ShowNotes:  show.Notes,
		Incident:   false,
		LogStatus:  "needs-log",
	}
	if log == nil {
		return entry
	}
	entry.AttendanceLogID = &log.ID
	entry.Draw = log.Draw
	entry.PostShowNotes = log.Notes
	entry.QuickHighlight = log.QuickHighlight
	entry.TotalDoorCents = log.TotalDoorCents
	entry.Incident = log.Incident
	entry.IncidentNotes = log.IncidentNotes
	entry.LoggedBy = log.LoggedBy
	if log.CreatedAt.IsZero() == false {
		entry.LoggedAt = log.CreatedAt.Format(time.RFC3339)
	}
	if log.UpdatedAt.IsZero() == false {
		entry.UpdatedAt = log.UpdatedAt.Format(time.RFC3339)
	}
	if log.Incident {
		entry.LogStatus = "incident"
	} else if log.Draw != nil && *log.Draw > 0 {
		entry.LogStatus = "logged"
	}
	return entry
}

func showLogMatchesSearch(entry showLogEntryResponse, search string) bool {
	if search == "" {
		return true
	}
	haystack := strings.ToLower(strings.Join([]string{entry.Artist, entry.Date, entry.Genre, entry.ShowNotes, entry.PostShowNotes, entry.IncidentNotes}, " "))
	return strings.Contains(haystack, strings.ToLower(search))
}

func (s *Server) showLogEntries(ctx context.Context, status, search string, limit, offset int) ([]showLogEntryResponse, error) {
	shows, err := s.showService.ListAll(ctx)
	if err != nil {
		return nil, err
	}
	logs, err := s.attendanceService.List(ctx, 10000, 0)
	if err != nil {
		return nil, err
	}
	logsByShow := make(map[int]domain.AttendanceLog, len(logs))
	for _, log := range logs {
		logsByShow[log.ShowID] = log
	}

	today := time.Now().Truncate(24 * time.Hour)
	entries := make([]showLogEntryResponse, 0, len(shows))
	for i := range shows {
		show := &shows[i]
		if show.Date.After(today) {
			continue
		}
		if show.Status != domain.StatusConfirmed && show.Status != domain.StatusArchived && show.Status != domain.StatusCancelled {
			continue
		}
		var log *domain.AttendanceLog
		if found, ok := logsByShow[show.ID]; ok {
			log = &found
		}
		entry := buildShowLogEntry(show, log)
		if status != "" && status != "all" && entry.LogStatus != status {
			continue
		}
		if !showLogMatchesSearch(entry, search) {
			continue
		}
		entries = append(entries, entry)
	}
	if offset > len(entries) {
		return []showLogEntryResponse{}, nil
	}
	end := len(entries)
	if limit > 0 && offset+limit < end {
		end = offset + limit
	}
	return entries[offset:end], nil
}

func (s *Server) handleListShowLog(w http.ResponseWriter, r *http.Request) {
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
	entries, err := s.showLogEntries(ctx, strings.TrimSpace(r.URL.Query().Get("status")), strings.TrimSpace(r.URL.Query().Get("search")), limit, offset)
	if err != nil {
		respondError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, showLogListResponse{Entries: entries})
}

func (s *Server) handleGetShowLog(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	showID, err := strconv.Atoi(r.PathValue("showId"))
	if err != nil {
		respondError(w, fmt.Errorf("invalid show ID: %w", err))
		return
	}
	show, err := s.showService.GetByID(ctx, showID)
	if err != nil {
		respondError(w, err)
		return
	}
	var log *domain.AttendanceLog
	if found, err := s.attendanceService.GetByShowID(ctx, showID); err == nil {
		log = found
	} else if !strings.Contains(err.Error(), "no rows") && !strings.Contains(err.Error(), "not found") {
		respondError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, buildShowLogEntry(show, log))
}

func (s *Server) handleUpsertShowLog(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}
	showID, err := strconv.Atoi(r.PathValue("showId"))
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
		Draw           *int   `json:"draw"`
		PostShowNotes  string `json:"postShowNotes"`
		QuickHighlight string `json:"quickHighlight"`
		TotalDoorCents *int   `json:"totalDoorCents"`
		Incident       bool   `json:"incident"`
		IncidentNotes  string `json:"incidentNotes"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		respondError(w, fmt.Errorf("invalid request body: %w", err))
		return
	}
	if req.Draw != nil && *req.Draw < 0 {
		respondError(w, fmt.Errorf("%w: draw cannot be negative", service.ErrValidation))
		return
	}
	if req.Draw != nil && *req.Draw > 10000 {
		respondError(w, fmt.Errorf("%w: draw looks too high", service.ErrValidation))
		return
	}
	if req.TotalDoorCents != nil && *req.TotalDoorCents < 0 {
		respondError(w, fmt.Errorf("%w: total door cannot be negative", service.ErrValidation))
		return
	}
	if req.Incident && strings.TrimSpace(req.IncidentNotes) == "" {
		respondError(w, fmt.Errorf("%w: incident notes are required", service.ErrValidation))
		return
	}
	actorID := int(user.ID)
	updated, err := s.attendanceService.Upsert(ctx, &domain.AttendanceLog{ShowID: showID, Draw: req.Draw, Notes: req.PostShowNotes, QuickHighlight: req.QuickHighlight, TotalDoorCents: req.TotalDoorCents, Incident: req.Incident, IncidentNotes: req.IncidentNotes, LoggedBy: &actorID})
	if err != nil {
		respondError(w, err)
		return
	}
	show, err := s.showService.GetByID(ctx, showID)
	if err != nil {
		respondError(w, err)
		return
	}
	entry := buildShowLogEntry(show, updated)
	entry.LoggedByName = user.DiscordUsername
	respondJSON(w, http.StatusOK, entry)
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
		BookingEmail           string `json:"bookingEmail"`
		Website                string `json:"website"`
		Timezone               string `json:"timezone"`
		DiscordGuildID         string `json:"discordGuildId"`
		DiscordChUpcoming      string `json:"discordChUpcoming"`
		DiscordChAnnouncements string `json:"discordChAnnouncements"`
		DiscordChStaff         string `json:"discordChStaff"`
		DiscordChBookings      string `json:"discordChBookings"`
		SetupComplete          bool   `json:"setupComplete"`
		AutoArchive            bool   `json:"autoArchive"`
		DiscordPosting         bool   `json:"discordPosting"`
		SafeSpaceRequired      bool   `json:"safeSpaceRequired"`
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
		BookingEmail:           req.BookingEmail,
		Website:                req.Website,
		Timezone:               req.Timezone,
		DiscordGuildID:         req.DiscordGuildID,
		DiscordChUpcoming:      req.DiscordChUpcoming,
		DiscordChAnnouncements: req.DiscordChAnnouncements,
		DiscordChStaff:         req.DiscordChStaff,
		DiscordChBookings:      req.DiscordChBookings,
		SetupComplete:          req.SetupComplete,
		AutoArchive:            req.AutoArchive,
		DiscordPosting:         req.DiscordPosting,
		SafeSpaceRequired:      req.SafeSpaceRequired,
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
