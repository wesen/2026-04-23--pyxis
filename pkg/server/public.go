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
		FlyerUrl:    show.FlyerURL,
		Status:      show.Status,
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error": map[string]string{
			"code":    code,
			"message": message,
		},
	})
}
