package server

import (
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
