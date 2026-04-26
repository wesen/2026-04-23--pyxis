package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/db"
)

type contextKey int

const userContextKey contextKey = iota

func (s *Server) handleDiscordCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	code := r.URL.Query().Get("code")
	if code == "" {
		respondError(w, fmt.Errorf("missing code"))
		return
	}

	token, user, err := s.authService.ExchangeCode(ctx, code)
	if err != nil {
		respondError(w, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // TODO: set to true in production with HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   7 * 24 * 60 * 60,
	})

	respondProtoJSON(w, http.StatusOK, dbUserToProto(user))
}

func (s *Server) handleGetMe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		respondError(w, fmt.Errorf("unauthenticated"))
		return
	}

	respondProtoJSON(w, http.StatusOK, dbUserToProto(user))
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	cookie, err := r.Cookie("session")
	if err == nil {
		_ = s.authService.Logout(ctx, cookie.Value)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

func (s *Server) handleGetSession(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)

	session := &pyxisv1.AuthSession{
		Authenticated: user != nil,
		SpaceName:     "Pyxis",
	}
	if user != nil {
		session.User = dbUserToProto(user)
	}

	respondProtoJSON(w, http.StatusOK, session)
}

func (s *Server) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session")
		if err != nil {
			respondError(w, fmt.Errorf("unauthenticated"))
			return
		}

		user, err := s.authService.ValidateSession(r.Context(), cookie.Value)
		if err != nil {
			respondError(w, fmt.Errorf("unauthenticated"))
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) userFromContext(ctx context.Context) *db.User {
	u, ok := ctx.Value(userContextKey).(*db.User)
	if !ok {
		return nil
	}
	return u
}

func dbUserToProto(user *db.User) *pyxisv1.User {
	pb := &pyxisv1.User{
		Id:              int32(user.ID),
		DiscordId:       user.DiscordID,
		DiscordUsername: user.DiscordUsername,
		Role:            user.Role,
		CreatedAt:       user.CreatedAt.Time.Format(time.RFC3339),
	}
	if user.AvatarUrl.Valid {
		pb.AvatarUrl = user.AvatarUrl.String
	}
	if user.LastLoginAt.Valid {
		pb.LastLoginAt = user.LastLoginAt.Time.Format(time.RFC3339)
	}
	return pb
}
