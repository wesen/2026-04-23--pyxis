package server

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-go-golems/pyxis/pkg/config"
	"github.com/go-go-golems/pyxis/pkg/service"
)

func TestDiscordOAuthStateRoundTrip(t *testing.T) {
	encoded, err := encodeDiscordOAuthState(discordOAuthState{ID: "state-123", ReturnTo: "/shows"})
	if err != nil {
		t.Fatalf("encode state: %v", err)
	}
	decoded, err := decodeDiscordOAuthState(encoded)
	if err != nil {
		t.Fatalf("decode state: %v", err)
	}
	if decoded.ID != "state-123" || decoded.ReturnTo != "/shows" {
		t.Fatalf("decoded = %#v", decoded)
	}
}

func TestDecodeDiscordOAuthStateRejectsEmptyID(t *testing.T) {
	encoded, err := encodeDiscordOAuthState(discordOAuthState{ReturnTo: "/shows"})
	if err != nil {
		t.Fatalf("encode state: %v", err)
	}
	if _, err := decodeDiscordOAuthState(encoded); err == nil {
		t.Fatalf("expected empty state ID to be rejected")
	}
}

func TestShouldUseSecureCookies(t *testing.T) {
	tests := []struct {
		name        string
		redirectURL string
		headerProto string
		want        bool
	}{
		{name: "https redirect", redirectURL: "https://pyxis.yolo.scapegoat.dev/auth/discord/callback", want: true},
		{name: "forwarded proto", redirectURL: "http://127.0.0.1:8080/auth/discord/callback", headerProto: "https", want: true},
		{name: "local http", redirectURL: "http://127.0.0.1:8080/auth/discord/callback", want: false},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			s := &Server{cfg: &config.Config{DiscordRedirectURL: tc.redirectURL}}
			req := httptest.NewRequest(http.MethodGet, "/", nil)
			if tc.headerProto != "" {
				req.Header.Set("X-Forwarded-Proto", tc.headerProto)
			}
			if got := s.shouldUseSecureCookies(req); got != tc.want {
				t.Fatalf("secure = %v, want %v", got, tc.want)
			}
		})
	}
}

func TestResolveReturnTo(t *testing.T) {
	s := &Server{cfg: &config.Config{WebsiteURL: "https://pyxis.yolo.scapegoat.dev", DiscordRedirectURL: "https://pyxis.yolo.scapegoat.dev/auth/discord/callback"}}
	req := httptest.NewRequest(http.MethodGet, "https://pyxis.yolo.scapegoat.dev/auth/discord/login", nil)
	tests := []struct {
		name    string
		value   string
		want    string
		wantErr bool
	}{
		{name: "empty", value: "", want: ""},
		{name: "relative", value: "/shows", want: "/shows"},
		{name: "same host absolute", value: "https://pyxis.yolo.scapegoat.dev/shows", want: "https://pyxis.yolo.scapegoat.dev/shows"},
		{name: "evil absolute", value: "https://evil.example/shows", wantErr: true},
		{name: "protocol relative", value: "//evil.example/shows", wantErr: true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := s.resolveReturnTo(req, tc.value)
			if tc.wantErr {
				if err == nil {
					t.Fatalf("expected error, got value %q", got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got != tc.want {
				t.Fatalf("return_to = %q, want %q", got, tc.want)
			}
		})
	}
}

func TestDiscordLoginRedirectsToDiscordAndSetsStateCookie(t *testing.T) {
	cfg := &config.Config{
		WebsiteURL:          "https://pyxis.yolo.scapegoat.dev",
		SessionCookieName:   "session",
		DiscordClientID:     "client-id",
		DiscordClientSecret: "client-secret",
		DiscordRedirectURL:  "https://pyxis.yolo.scapegoat.dev/auth/discord/callback",
	}
	s := &Server{
		cfg: cfg,
		authService: service.NewAuthService(nil, service.DiscordOAuthConfig{
			ClientID:     cfg.DiscordClientID,
			ClientSecret: cfg.DiscordClientSecret,
			RedirectURL:  cfg.DiscordRedirectURL,
		}),
	}

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/auth/discord/login?return_to=%2Fshows", nil)
	s.handleDiscordLogin(rr, req)

	if rr.Code != http.StatusFound {
		t.Fatalf("status = %d, want 302", rr.Code)
	}
	location := rr.Header().Get("Location")
	for _, want := range []string{"https://discord.com/oauth2/authorize", "client_id=client-id", "response_type=code", "scope=identify", "state="} {
		if !strings.Contains(location, want) {
			t.Fatalf("Location %q does not contain %q", location, want)
		}
	}
	if cookie := rr.Result().Cookies(); len(cookie) == 0 {
		t.Fatalf("expected state cookie")
	}
	if got := rr.Result().Cookies()[0].Name; got != discordOAuthStateCookieName {
		t.Fatalf("cookie name = %q, want %q", got, discordOAuthStateCookieName)
	}
}

func TestDiscordLoginUnavailableWithoutOAuthConfig(t *testing.T) {
	s := &Server{cfg: &config.Config{WebsiteURL: "https://pyxis.yolo.scapegoat.dev"}}
	rr := httptest.NewRecorder()
	s.handleDiscordLogin(rr, httptest.NewRequest(http.MethodGet, "/auth/discord/login", nil))
	if rr.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503", rr.Code)
	}
}

func TestDiscordCallbackRejectsMissingCode(t *testing.T) {
	s := &Server{cfg: &config.Config{DiscordRedirectURL: "https://pyxis.yolo.scapegoat.dev/auth/discord/callback"}}
	rr := httptest.NewRecorder()
	s.handleDiscordCallback(rr, httptest.NewRequest(http.MethodGet, "/auth/discord/callback?state=abc", nil))
	if rr.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", rr.Code)
	}
}

func TestDiscordCallbackRejectsMissingState(t *testing.T) {
	s := &Server{cfg: &config.Config{DiscordRedirectURL: "https://pyxis.yolo.scapegoat.dev/auth/discord/callback"}}
	rr := httptest.NewRecorder()
	s.handleDiscordCallback(rr, httptest.NewRequest(http.MethodGet, "/auth/discord/callback?code=abc", nil))
	if rr.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", rr.Code)
	}
}

func TestDiscordCallbackRejectsStateCookieMismatch(t *testing.T) {
	state, err := encodeDiscordOAuthState(discordOAuthState{ID: "state-from-query"})
	if err != nil {
		t.Fatalf("encode state: %v", err)
	}
	s := &Server{cfg: &config.Config{DiscordRedirectURL: "https://pyxis.yolo.scapegoat.dev/auth/discord/callback"}}
	req := httptest.NewRequest(http.MethodGet, "/auth/discord/callback?code=abc&state="+state, nil)
	req.AddCookie(&http.Cookie{Name: discordOAuthStateCookieName, Value: "different-state"})
	rr := httptest.NewRecorder()
	s.handleDiscordCallback(rr, req)
	if rr.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", rr.Code)
	}
}
