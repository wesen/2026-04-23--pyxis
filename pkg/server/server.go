package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-go-golems/pyxis/internal/web"
	"github.com/go-go-golems/pyxis/pkg/config"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/discord"
	"github.com/go-go-golems/pyxis/pkg/repository/postgres"
	"github.com/go-go-golems/pyxis/pkg/service"
	"github.com/go-go-golems/pyxis/pkg/storage"
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
	settingsService   *service.SettingsService
	auditService      service.AuditService
	authService       *service.AuthService
	flyerStore        storage.FlyerStore
}

// New creates a new Server with routes wired.
func New(cfg *config.Config, database *db.Pool) *Server {
	s := &Server{cfg: cfg}

	// Repository layer
	queries := db.New(database.Pool)
	showRepo := postgres.NewShowRepo(queries, database.Pool)
	submissionRepo := postgres.NewSubmissionRepo(queries)
	artistRepo := postgres.NewArtistRepo(queries)
	auditRepo := postgres.NewAuditRepo(queries)
	calendarRepo := postgres.NewCalendarRepo(queries)
	attendanceRepo := postgres.NewAttendanceRepo(queries)
	settingsRepo := postgres.NewSettingsRepo(queries)

	// Storage layer
	s.flyerStore = storage.NewLocalFlyerStore("./data/flyers", "/flyers")

	// Service layer
	discordClient := discord.Client(&discord.NoOpClient{})
	s.auditService = service.NewAuditService(auditRepo)
	s.showService = service.NewShowService(showRepo, s.auditService, discordClient)
	s.artistService = service.NewArtistService(artistRepo)
	s.calendarService = service.NewCalendarService(calendarRepo)
	s.attendanceService = service.NewAttendanceService(attendanceRepo)
	s.settingsService = service.NewSettingsService(settingsRepo)
	s.submissionService = service.NewSubmissionService(
		submissionRepo, showRepo, artistRepo, s.auditService, database.Pool,
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
	mux.HandleFunc("POST /auth/dev-login", s.handleDevLogin)
	mux.HandleFunc("GET /auth/dev-login", s.handleDevLogin)
	mux.HandleFunc("GET /auth/discord/callback", s.handleDiscordCallback)
	mux.Handle("GET /auth/me", s.requireAuth(http.HandlerFunc(s.handleGetMe)))
	mux.Handle("POST /auth/logout", s.requireAuth(http.HandlerFunc(s.handleLogout)))

	mux.HandleFunc("GET /api/app/session", s.handleGetSession)

	// Staff show endpoints
	mux.Handle("GET /api/app/shows", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListAppShows))))
	mux.Handle("GET /api/app/shows/{id}", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleGetAppShow))))
	mux.Handle("POST /api/app/shows", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCreateShow))))
	mux.Handle("PATCH /api/app/shows/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleUpdateShow))))
	mux.Handle("PATCH /api/app/shows/{id}/cancel", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCancelShow))))
	mux.Handle("PATCH /api/app/shows/{id}/archive", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleArchiveShow))))
	mux.Handle("POST /api/app/shows/{id}/announce", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleAnnounceShow))))

	// Staff flyer endpoints
	mux.Handle("POST /api/app/shows/{id}/flyer", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleUploadFlyer))))
	mux.Handle("DELETE /api/app/shows/{id}/flyer", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleDeleteFlyer))))

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

	// Staff settings endpoints
	mux.Handle("GET /api/app/settings", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleGetSettings))))
	mux.Handle("PATCH /api/app/settings", s.requireAuth(s.requireRole("admin")(http.HandlerFunc(s.handleUpdateSettings))))

	// Staff audit log endpoints
	mux.Handle("GET /api/app/audit-log", s.requireAuth(s.requireRole("admin")(http.HandlerFunc(s.handleListAuditLog))))

	// Public flyer assets. Keep this before the SPA fallback so flyer URLs emitted
	// by the API resolve to uploaded local files during development/single-binary
	// deployments. Future S3/R2 storage can replace this route.
	mux.Handle("GET /flyers/", http.StripPrefix("/flyers/", http.FileServer(http.Dir("./data/flyers"))))

	// Public user-site SPA. The Go 1.22 ServeMux rejects a root catch-all mixed
	// with method-specific API patterns, so wrap the API mux and delegate only
	// unmatched 404s to the SPA fallback. React Router browser routes such as
	// /shows/42 then return index.html while API/auth/health/flyer routes keep
	// priority.
	s.handler = spaFallbackHandler{primary: mux, fallback: web.NewSPAHandler()}
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
