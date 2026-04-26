package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-go-golems/pyxis/pkg/config"
	"github.com/rs/zerolog/log"
)

// Server holds the HTTP handler and dependencies.
type Server struct {
	cfg     *config.Config
	handler http.Handler
}

// New creates a new Server with routes wired but no DB yet.
func New(cfg *config.Config) *Server {
	s := &Server{cfg: cfg}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

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
