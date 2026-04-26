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
	artistService     *service.ArtistService
	calendarService   *service.CalendarService
	attendanceService *service.AttendanceService
	authService       *service.AuthService
}

// New creates a new Server with routes wired.
func New(cfg *config.Config, database *db.Pool) *Server {
	s := &Server{cfg: cfg}

	// Repository layer
	queries := db.New(database.Pool)
	showRepo := postgres.NewShowRepo(queries)
	submissionRepo := postgres.NewSubmissionRepo(queries)
	artistRepo := postgres.NewArtistRepo(queries)
	auditRepo := postgres.NewAuditRepo(queries)
	calendarRepo := postgres.NewCalendarRepo(queries)
	attendanceRepo := postgres.NewAttendanceRepo(queries)

	// Service layer
	auditSvc := service.NewAuditService(auditRepo)
	s.showService = service.NewShowService(showRepo, auditSvc)
	s.artistService = service.NewArtistService(artistRepo)
	s.calendarService = service.NewCalendarService(calendarRepo)
	s.attendanceService = service.NewAttendanceService(attendanceRepo)
	s.submissionService = service.NewSubmissionService(
		submissionRepo, showRepo, artistRepo, auditSvc, database.Pool,
	)

	// Auth service (uses placeholder config; override in production)
	s.authService = service.NewAuthService(queries, service.DiscordOAuthConfig{
		ClientID:     cfg.DiscordClientID,
		ClientSecret: cfg.DiscordClientSecret,
		RedirectURL:  cfg.DiscordRedirectURL,
	})

	// Router
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Public API (no auth)
	mux.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
	mux.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
	mux.HandleFunc("GET /api/public/archive", s.handleGetArchive)
	mux.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
	mux.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)

	// Auth
	mux.HandleFunc("GET /auth/discord/callback", s.handleDiscordCallback)
	mux.Handle("GET /auth/me", s.requireAuth(http.HandlerFunc(s.handleGetMe)))
	mux.Handle("POST /auth/logout", s.requireAuth(http.HandlerFunc(s.handleLogout)))

	mux.HandleFunc("GET /api/app/session", s.handleGetSession)

	// Staff show endpoints
	mux.Handle("GET /api/app/shows", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListAppShows))))
	mux.Handle("POST /api/app/shows", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCreateShow))))
	mux.Handle("PATCH /api/app/shows/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleUpdateShow))))
	mux.Handle("PATCH /api/app/shows/{id}/cancel", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCancelShow))))
	mux.Handle("PATCH /api/app/shows/{id}/archive", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleArchiveShow))))

	// Staff booking endpoints
	mux.Handle("GET /api/app/bookings", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleListBookings))))
	mux.Handle("PATCH /api/app/bookings/{id}/approve", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleApproveBooking))))
	mux.Handle("PATCH /api/app/bookings/{id}/decline", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleDeclineBooking))))

	// Staff artist endpoints
	mux.Handle("GET /api/app/artists", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListArtists))))
	mux.Handle("GET /api/app/artists/{id}", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleGetArtist))))
	mux.Handle("PATCH /api/app/artists/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleUpdateArtist))))

	// Staff calendar endpoints
	mux.Handle("GET /api/app/calendar", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListCalendar))))
	mux.Handle("POST /api/app/calendar/holds", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCreateCalendarHold))))
	mux.Handle("DELETE /api/app/calendar/holds/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleDeleteCalendarHold))))
	mux.Handle("POST /api/app/calendar/blocked", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCreateCalendarBlocked))))
	mux.Handle("DELETE /api/app/calendar/blocked/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleDeleteCalendarBlocked))))

	// Staff attendance endpoints
	mux.Handle("GET /api/app/attendance", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListAttendance))))
	mux.Handle("GET /api/app/attendance/{showId}", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleGetAttendance))))
	mux.Handle("PATCH /api/app/attendance/{showId}", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleUpsertAttendance))))

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
