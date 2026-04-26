package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-go-golems/pyxis/pkg/config"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/repository/postgres"
	"github.com/go-go-golems/pyxis/pkg/service"
	"github.com/rs/zerolog/log"
)

// Server holds the HTTP handler and dependencies.
type Server struct {
	cfg               *config.Config
	handler           http.Handler
	showService       *service.ShowService
	submissionService *service.SubmissionService
}

// New creates a new Server with routes wired.
func New(cfg *config.Config, database *db.Pool) *Server {
	s := &Server{cfg: cfg}

	// Repository layer
	queries := db.New(database.Pool)
	showRepo := postgres.NewShowRepo(queries)
	submissionRepo := postgres.NewSubmissionRepo(queries)

	// Service layer
	s.showService = service.NewShowService(showRepo)
	s.submissionService = service.NewSubmissionService(submissionRepo)

	// Router
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Public API
	mux.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
	mux.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
	mux.HandleFunc("GET /api/public/archive", s.handleGetArchive)
	mux.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
	mux.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)

	s.handler = mux
	return s
}

// Start runs the HTTP server.
func (s *Server) Start(ctx context.Context, bind string) error {
	log.Info().Str("bind", bind).Msg("starting HTTP server")
	srv := &http.Server{
		Addr:    bind,
		Handler: s.handler,
	}

	go func() {
		<-ctx.Done()
		log.Info().Msg("shutting down HTTP server")
		_ = srv.Shutdown(context.Background())
	}()

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("server error: %w", err)
	}
	return nil
}
