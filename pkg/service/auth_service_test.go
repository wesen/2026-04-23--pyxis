package service

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMapDiscordRoleUsesMostPrivilegedConfiguredRole(t *testing.T) {
	tests := []struct {
		name  string
		roles string
		want  string
	}{
		{name: "admin wins", roles: `{"roles":["door-role","admin-role","booker-role"]}`, want: "admin"},
		{name: "booker before door", roles: `{"roles":["door-role","booker-role"]}`, want: "booker"},
		{name: "door", roles: `{"roles":["door-role"]}`, want: "door"},
		{name: "unmapped staff", roles: `{"roles":["other-role"]}`, want: "staff"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if got := r.Header.Get("Authorization"); got != "Bot bot-token" {
					t.Fatalf("Authorization = %q", got)
				}
				if r.URL.Path != "/guilds/guild-id/members/user-id" {
					t.Fatalf("path = %q", r.URL.Path)
				}
				_, _ = w.Write([]byte(tc.roles))
			}))
			defer server.Close()

			svc := NewAuthService(nil, DiscordOAuthConfig{
				BotToken:     "bot-token",
				GuildID:      "guild-id",
				AdminRoleID:  "admin-role",
				BookerRoleID: "booker-role",
				DoorRoleID:   "door-role",
			})
			svc.apiBase = server.URL

			got, err := svc.mapDiscordRole(context.Background(), "user-id")
			if err != nil {
				t.Fatalf("map role: %v", err)
			}
			if got != tc.want {
				t.Fatalf("role = %q, want %q", got, tc.want)
			}
		})
	}
}

func TestMapDiscordRoleWithoutMappingDefaultsToStaff(t *testing.T) {
	svc := NewAuthService(nil, DiscordOAuthConfig{})
	got, err := svc.mapDiscordRole(context.Background(), "user-id")
	if err != nil {
		t.Fatalf("map role: %v", err)
	}
	if got != "staff" {
		t.Fatalf("role = %q, want staff", got)
	}
}

func TestMapDiscordRoleRequiresBotTokenAndGuildWhenMappingConfigured(t *testing.T) {
	tests := []struct {
		name string
		cfg  DiscordOAuthConfig
	}{
		{name: "missing bot token", cfg: DiscordOAuthConfig{GuildID: "guild-id", AdminRoleID: "admin-role"}},
		{name: "missing guild", cfg: DiscordOAuthConfig{BotToken: "bot-token", AdminRoleID: "admin-role"}},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			svc := NewAuthService(nil, tc.cfg)
			if _, err := svc.mapDiscordRole(context.Background(), "user-id"); err == nil {
				t.Fatalf("expected role mapping error")
			}
		})
	}
}
