package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/rs/zerolog/log"
	"golang.org/x/oauth2"
)

const discordAPIBaseURL = "https://discord.com/api/v10"

// DiscordOAuthConfig holds OAuth2 settings.
type DiscordOAuthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
	BotToken     string
	GuildID      string
	AdminRoleID  string
	BookerRoleID string
	DoorRoleID   string
}

// AuthService handles Discord OAuth and sessions.
type AuthService struct {
	queries *db.Queries
	oauth   *oauth2.Config
	cfg     DiscordOAuthConfig
	client  *http.Client
	apiBase string
}

// NewAuthService creates a new AuthService.
func NewAuthService(queries *db.Queries, cfg DiscordOAuthConfig) *AuthService {
	return &AuthService{
		queries: queries,
		cfg:     cfg,
		client:  &http.Client{Timeout: 10 * time.Second},
		apiBase: discordAPIBaseURL,
		oauth: &oauth2.Config{
			ClientID:     cfg.ClientID,
			ClientSecret: cfg.ClientSecret,
			RedirectURL:  cfg.RedirectURL,
			Scopes:       []string{"identify"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://discord.com/oauth2/authorize",
				TokenURL: "https://discord.com/api/oauth2/token",
			},
		},
	}
}

// AuthCodeURL returns the Discord OAuth authorization URL for a browser login.
func (s *AuthService) AuthCodeURL(state string) string {
	return s.oauth.AuthCodeURL(state)
}

// DiscordUser represents the user profile from Discord API.
type DiscordUser struct {
	ID            string `json:"id"`
	Username      string `json:"username"`
	Avatar        string `json:"avatar"`
	Discriminator string `json:"discriminator"`
}

type discordGuildMember struct {
	Roles []string `json:"roles"`
}

// ExchangeCode exchanges an OAuth code for a user and creates a session.
func (s *AuthService) ExchangeCode(ctx context.Context, code string) (sessionToken string, user *db.User, err error) {
	log.Debug().Bool("role_mapping_configured", s.hasRoleMappingConfig()).Msg("discord oauth: exchanging callback code")
	token, err := s.oauth.Exchange(ctx, code)
	if err != nil {
		log.Warn().Err(err).Msg("discord oauth: token exchange failed")
		return "", nil, fmt.Errorf("exchange code: %w", err)
	}

	client := s.oauth.Client(ctx, token)
	resp, err := client.Get(s.apiBase + "/users/@me")
	if err != nil {
		log.Warn().Err(err).Msg("discord oauth: fetch user request failed")
		return "", nil, fmt.Errorf("fetch user: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body := readDiscordErrorBody(resp.Body)
		log.Warn().Int("status", resp.StatusCode).Str("body", body).Msg("discord oauth: fetch user returned non-OK status")
		return "", nil, fmt.Errorf("fetch user: discord status %d", resp.StatusCode)
	}

	var du DiscordUser
	if err := json.NewDecoder(resp.Body).Decode(&du); err != nil {
		log.Warn().Err(err).Msg("discord oauth: decode user failed")
		return "", nil, fmt.Errorf("decode user: %w", err)
	}
	if strings.TrimSpace(du.ID) == "" {
		log.Warn().Msg("discord oauth: decoded user without discord id")
		return "", nil, fmt.Errorf("decode user: missing discord id")
	}
	log.Info().Str("discord_user_id", du.ID).Str("discord_username", du.Username).Bool("role_mapping_configured", s.hasRoleMappingConfig()).Msg("discord oauth: fetched user")

	role, err := s.mapDiscordRole(ctx, du.ID)
	if err != nil {
		log.Warn().Err(err).Str("discord_user_id", du.ID).Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).Msg("discord oauth: map discord role failed")
		return "", nil, err
	}
	log.Info().Str("discord_user_id", du.ID).Str("mapped_role", role).Msg("discord oauth: mapped user role")

	// Upsert user, mapping configured Discord role IDs to local Pyxis roles.
	row, err := s.queries.UpsertUser(ctx, db.UpsertUserParams{
		DiscordID:       du.ID,
		DiscordUsername: du.Username,
		AvatarUrl:       pgtype.Text{String: du.Avatar, Valid: du.Avatar != ""},
		Role:            role,
	})
	if err != nil {
		log.Warn().Err(err).Str("discord_user_id", du.ID).Str("mapped_role", role).Msg("discord oauth: upsert user failed")
		return "", nil, fmt.Errorf("upsert user: %w", err)
	}

	// Create session
	sessionToken, err = s.createSession(ctx, row.ID)
	if err != nil {
		log.Warn().Err(err).Int32("user_id", row.ID).Msg("discord oauth: create session failed")
		return "", nil, fmt.Errorf("create session: %w", err)
	}
	log.Info().Int32("user_id", row.ID).Str("discord_user_id", du.ID).Str("mapped_role", row.Role).Msg("discord oauth: login succeeded")

	return sessionToken, &row, nil
}

func (s *AuthService) mapDiscordRole(ctx context.Context, discordUserID string) (string, error) {
	if !s.hasRoleMappingConfig() {
		log.Info().Str("discord_user_id", discordUserID).Msg("discord oauth: no role mapping configured, defaulting to staff")
		return "staff", nil
	}
	if strings.TrimSpace(s.cfg.BotToken) == "" {
		return "", fmt.Errorf("discord role mapping requires discord-bot-token")
	}
	if strings.TrimSpace(s.cfg.GuildID) == "" {
		return "", fmt.Errorf("discord role mapping requires discord-guild-id")
	}

	log.Info().
		Str("discord_user_id", discordUserID).
		Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).
		Bool("admin_role_configured", strings.TrimSpace(s.cfg.AdminRoleID) != "").
		Bool("booker_role_configured", strings.TrimSpace(s.cfg.BookerRoleID) != "").
		Bool("door_role_configured", strings.TrimSpace(s.cfg.DoorRoleID) != "").
		Msg("discord oauth: fetching guild member roles")
	roles, err := s.fetchGuildMemberRoles(ctx, discordUserID)
	if err != nil {
		return "", err
	}
	roleSet := map[string]struct{}{}
	for _, role := range roles {
		role = strings.TrimSpace(role)
		if role != "" {
			roleSet[role] = struct{}{}
		}
	}
	log.Info().Str("discord_user_id", discordUserID).Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).Strs("discord_role_ids", roles).Msg("discord oauth: fetched guild member roles")

	// Most privileged matching role wins.
	if hasRole(roleSet, s.cfg.AdminRoleID) {
		return "admin", nil
	}
	if hasRole(roleSet, s.cfg.BookerRoleID) {
		return "booker", nil
	}
	if hasRole(roleSet, s.cfg.DoorRoleID) {
		return "door", nil
	}
	return "staff", nil
}

func (s *AuthService) hasRoleMappingConfig() bool {
	return strings.TrimSpace(s.cfg.AdminRoleID) != "" ||
		strings.TrimSpace(s.cfg.BookerRoleID) != "" ||
		strings.TrimSpace(s.cfg.DoorRoleID) != ""
}

func (s *AuthService) fetchGuildMemberRoles(ctx context.Context, discordUserID string) ([]string, error) {
	url := fmt.Sprintf("%s/guilds/%s/members/%s", s.apiBase, strings.TrimSpace(s.cfg.GuildID), strings.TrimSpace(discordUserID))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bot "+strings.TrimSpace(s.cfg.BotToken))
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		log.Warn().Err(err).Str("discord_user_id", discordUserID).Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).Msg("discord oauth: guild member request failed")
		return nil, fmt.Errorf("fetch guild member roles: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusNotFound {
		body := readDiscordErrorBody(resp.Body)
		log.Warn().
			Int("status", resp.StatusCode).
			Str("discord_user_id", discordUserID).
			Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).
			Str("body", body).
			Msg("discord oauth: user is not a member of configured guild or guild is not visible to bot")
		return nil, fmt.Errorf("discord user is not a member of configured guild")
	}
	if resp.StatusCode != http.StatusOK {
		body := readDiscordErrorBody(resp.Body)
		log.Warn().
			Int("status", resp.StatusCode).
			Str("discord_user_id", discordUserID).
			Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).
			Str("body", body).
			Msg("discord oauth: guild member roles returned non-OK status")
		return nil, fmt.Errorf("fetch guild member roles: discord status %d", resp.StatusCode)
	}

	var member discordGuildMember
	if err := json.NewDecoder(resp.Body).Decode(&member); err != nil {
		log.Warn().Err(err).Str("discord_user_id", discordUserID).Str("discord_guild_id", strings.TrimSpace(s.cfg.GuildID)).Msg("discord oauth: decode guild member roles failed")
		return nil, fmt.Errorf("decode guild member roles: %w", err)
	}
	return member.Roles, nil
}

func readDiscordErrorBody(r io.Reader) string {
	body, _ := io.ReadAll(io.LimitReader(r, 4096))
	return strings.TrimSpace(string(body))
}

func hasRole(roleSet map[string]struct{}, roleID string) bool {
	roleID = strings.TrimSpace(roleID)
	if roleID == "" {
		return false
	}
	_, ok := roleSet[roleID]
	return ok
}

// ValidateSession checks a session token and returns the user.
func (s *AuthService) ValidateSession(ctx context.Context, token string) (*db.User, error) {
	row, err := s.queries.GetSession(ctx, token)
	if err != nil {
		return nil, fmt.Errorf("invalid session")
	}
	if row.ExpiresAt.Time.Before(time.Now()) {
		return nil, fmt.Errorf("session expired")
	}
	user, err := s.queries.GetUser(ctx, row.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return &user, nil
}

// CreateDevSession creates or updates a local development user and returns a
// session token. It is intended for explicit PYXIS_DEV_AUTH=1 workflows only.
func (s *AuthService) CreateDevSession(ctx context.Context, username, role string) (sessionToken string, user *db.User, err error) {
	if username == "" {
		username = "dev-admin"
	}
	if role == "" {
		role = "admin"
	}

	row, err := s.queries.UpsertDevUser(ctx, db.UpsertDevUserParams{
		DiscordID:       "dev:" + username,
		DiscordUsername: username,
		AvatarUrl:       pgtype.Text{},
		Role:            role,
	})
	if err != nil {
		return "", nil, fmt.Errorf("upsert dev user: %w", err)
	}

	sessionToken, err = s.createSession(ctx, row.ID)
	if err != nil {
		return "", nil, fmt.Errorf("create dev session: %w", err)
	}

	return sessionToken, &row, nil
}

// Logout deletes a session.
func (s *AuthService) Logout(ctx context.Context, token string) error {
	return s.queries.DeleteSession(ctx, token)
}

func (s *AuthService) createSession(ctx context.Context, userID int32) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	token := hex.EncodeToString(b)
	expiresAt := time.Now().Add(7 * 24 * time.Hour)

	_, err := s.queries.CreateSession(ctx, db.CreateSessionParams{
		ID:        token,
		UserID:    userID,
		ExpiresAt: pgtype.Timestamptz{Time: expiresAt, Valid: true},
	})
	return token, err
}
