package server

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/rs/zerolog/log"
)

type contextKey int

const userContextKey contextKey = iota

const discordOAuthStateCookieName = "pyxis_discord_oauth_state"

type discordOAuthState struct {
	ID       string `json:"id"`
	ReturnTo string `json:"rt,omitempty"`
}

func (s *Server) handleDiscordLogin(w http.ResponseWriter, r *http.Request) {
	if !s.discordOAuthConfigured() {
		log.Warn().Msg("discord oauth: login requested but oauth is not configured")
		http.Error(w, "Discord OAuth is not configured", http.StatusServiceUnavailable)
		return
	}

	returnTo, err := s.resolveReturnTo(r, r.URL.Query().Get("return_to"))
	if err != nil {
		log.Warn().Err(err).Str("return_to", r.URL.Query().Get("return_to")).Msg("discord oauth: invalid return_to parameter")
		http.Error(w, "invalid return_to parameter", http.StatusBadRequest)
		return
	}

	stateID, err := randomURLToken(24)
	if err != nil {
		http.Error(w, "failed to create oauth state", http.StatusInternalServerError)
		return
	}
	state, err := encodeDiscordOAuthState(discordOAuthState{ID: stateID, ReturnTo: returnTo})
	if err != nil {
		http.Error(w, "failed to encode oauth state", http.StatusInternalServerError)
		return
	}

	secure := s.shouldUseSecureCookies(r)
	setShortLivedCookie(w, discordOAuthStateCookieName, stateID, secure)
	log.Info().Str("return_to", returnTo).Bool("secure_cookie", secure).Msg("discord oauth: redirecting to discord authorization")
	http.Redirect(w, r, s.authService.AuthCodeURL(state), http.StatusFound)
}

func (s *Server) handleDiscordCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	code := strings.TrimSpace(r.URL.Query().Get("code"))
	if code == "" {
		log.Warn().Msg("discord oauth: callback missing code")
		http.Error(w, "missing code", http.StatusBadRequest)
		return
	}

	stateValue := strings.TrimSpace(r.URL.Query().Get("state"))
	if stateValue == "" {
		log.Warn().Msg("discord oauth: callback missing state")
		http.Error(w, "missing state", http.StatusBadRequest)
		return
	}
	state, err := decodeDiscordOAuthState(stateValue)
	if err != nil {
		log.Warn().Err(err).Msg("discord oauth: callback state decode failed")
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}
	stateCookie, err := r.Cookie(discordOAuthStateCookieName)
	if err != nil || strings.TrimSpace(stateCookie.Value) == "" || subtle.ConstantTimeCompare([]byte(stateCookie.Value), []byte(state.ID)) != 1 {
		log.Warn().Err(err).Bool("state_cookie_present", err == nil).Msg("discord oauth: callback state cookie mismatch")
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}

	secure := s.shouldUseSecureCookies(r)
	clearCookie(w, discordOAuthStateCookieName, secure)
	log.Info().Str("return_to", state.ReturnTo).Bool("secure_cookie", secure).Msg("discord oauth: callback state validated")
	token, user, err := s.authService.ExchangeCode(ctx, code)
	if err != nil {
		log.Warn().Err(err).Str("return_to", state.ReturnTo).Msg("discord oauth: callback exchange failed")
		respondError(w, err)
		return
	}

	s.setSessionCookie(w, r, token)
	if user != nil {
		log.Info().Int32("user_id", user.ID).Str("discord_user_id", user.DiscordID).Str("role", user.Role).Msg("discord oauth: callback set session cookie")
	}
	redirectTarget := "/"
	if strings.TrimSpace(state.ReturnTo) != "" {
		redirectTarget = state.ReturnTo
	}
	http.Redirect(w, r, redirectTarget, http.StatusSeeOther)
}

func (s *Server) handleDevLogin(w http.ResponseWriter, r *http.Request) {
	if os.Getenv("PYXIS_DEV_AUTH") != "1" {
		respondError(w, fmt.Errorf("not found"))
		return
	}

	username := r.URL.Query().Get("username")
	role := r.URL.Query().Get("role")
	token, user, err := s.authService.CreateDevSession(r.Context(), username, role)
	if err != nil {
		respondError(w, err)
		return
	}

	s.setSessionCookie(w, r, token)
	respondProtoJSON(w, http.StatusOK, &pyxisv1.AuthSession{
		Authenticated: true,
		SpaceName:     "Pyxis",
		User:          dbUserToProto(user),
	})
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

	cookie, err := r.Cookie(s.sessionCookieName())
	if err == nil {
		_ = s.authService.Logout(ctx, cookie.Value)
	}

	s.clearSessionCookie(w, r)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

func (s *Server) handleGetSession(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user := s.userFromContext(ctx)
	if user == nil {
		if cookie, err := r.Cookie(s.sessionCookieName()); err == nil {
			if validated, err := s.authService.ValidateSession(ctx, cookie.Value); err == nil {
				user = validated
			}
		}
	}

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
		cookie, err := r.Cookie(s.sessionCookieName())
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

func (s *Server) discordOAuthConfigured() bool {
	return strings.TrimSpace(s.cfg.DiscordClientID) != "" &&
		strings.TrimSpace(s.cfg.DiscordClientSecret) != "" &&
		strings.TrimSpace(s.cfg.DiscordRedirectURL) != ""
}

func (s *Server) sessionCookieName() string {
	if s.cfg != nil && strings.TrimSpace(s.cfg.SessionCookieName) != "" {
		return strings.TrimSpace(s.cfg.SessionCookieName)
	}
	return "session"
}

func (s *Server) setSessionCookie(w http.ResponseWriter, r *http.Request, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     s.sessionCookieName(),
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   s.shouldUseSecureCookies(r),
		SameSite: http.SameSiteLaxMode,
		MaxAge:   7 * 24 * 60 * 60,
	})
}

func (s *Server) clearSessionCookie(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     s.sessionCookieName(),
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   s.shouldUseSecureCookies(r),
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0).UTC(),
	})
}

func (s *Server) shouldUseSecureCookies(r *http.Request) bool {
	if r != nil {
		if r.TLS != nil {
			return true
		}
		if strings.EqualFold(strings.TrimSpace(r.Header.Get("X-Forwarded-Proto")), "https") {
			return true
		}
	}
	if s.cfg == nil || strings.TrimSpace(s.cfg.DiscordRedirectURL) == "" {
		return false
	}
	parsed, err := url.Parse(s.cfg.DiscordRedirectURL)
	return err == nil && strings.EqualFold(parsed.Scheme, "https")
}

func (s *Server) resolveReturnTo(r *http.Request, raw string) (string, error) {
	value := strings.TrimSpace(raw)
	if value == "" {
		return "", nil
	}
	if strings.HasPrefix(value, "/") {
		if strings.HasPrefix(value, "//") || strings.HasPrefix(value, `/\\`) {
			return "", fmt.Errorf("return_to must stay on this origin")
		}
		return value, nil
	}

	parsed, err := url.Parse(value)
	if err != nil {
		return "", err
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return "", fmt.Errorf("return_to must use http or https")
	}
	if parsed.Host == "" {
		return "", fmt.Errorf("return_to must include a host")
	}

	allowed := map[string]struct{}{}
	if r != nil && r.Host != "" {
		allowed[strings.ToLower(hostWithoutPort(r.Host))] = struct{}{}
	}
	if s.cfg != nil && strings.TrimSpace(s.cfg.WebsiteURL) != "" {
		if websiteURL, err := url.Parse(s.cfg.WebsiteURL); err == nil {
			allowed[strings.ToLower(websiteURL.Hostname())] = struct{}{}
		}
	}
	if s.cfg != nil && strings.TrimSpace(s.cfg.DiscordRedirectURL) != "" {
		if redirectURL, err := url.Parse(s.cfg.DiscordRedirectURL); err == nil {
			allowed[strings.ToLower(redirectURL.Hostname())] = struct{}{}
		}
	}
	if _, ok := allowed[strings.ToLower(parsed.Hostname())]; !ok {
		return "", fmt.Errorf("return_to host is not allowed")
	}
	return parsed.String(), nil
}

func hostWithoutPort(value string) string {
	host := strings.TrimSpace(value)
	if parsed, err := url.Parse("//" + host); err == nil && parsed.Hostname() != "" {
		return parsed.Hostname()
	}
	return host
}

func setShortLivedCookie(w http.ResponseWriter, name, value string, secure bool) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int((10 * time.Minute).Seconds()),
	})
}

func clearCookie(w http.ResponseWriter, name string, secure bool) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0).UTC(),
	})
}

func encodeDiscordOAuthState(state discordOAuthState) (string, error) {
	raw, err := json.Marshal(state)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(raw), nil
}

func decodeDiscordOAuthState(value string) (discordOAuthState, error) {
	raw, err := base64.RawURLEncoding.DecodeString(value)
	if err != nil {
		return discordOAuthState{}, err
	}
	var state discordOAuthState
	if err := json.Unmarshal(raw, &state); err != nil {
		return discordOAuthState{}, err
	}
	if strings.TrimSpace(state.ID) == "" {
		return discordOAuthState{}, fmt.Errorf("state id is required")
	}
	return state, nil
}

func randomURLToken(size int) (string, error) {
	raw := make([]byte, size)
	if _, err := rand.Read(raw); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(raw), nil
}
