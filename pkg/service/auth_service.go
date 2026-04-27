package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
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
	token, err := s.oauth.Exchange(ctx, code)
	if err != nil {
		return "", nil, fmt.Errorf("exchange code: %w", err)
	}

	client := s.oauth.Client(ctx, token)
	resp, err := client.Get(s.apiBase + "/users/@me")
	if err != nil {
		return "", nil, fmt.Errorf("fetch user: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", nil, fmt.Errorf("fetch user: discord status %d", resp.StatusCode)
	}

	var du DiscordUser
	if err := json.NewDecoder(resp.Body).Decode(&du); err != nil {
		return "", nil, fmt.Errorf("decode user: %w", err)
	}
	if strings.TrimSpace(du.ID) == "" {
		return "", nil, fmt.Errorf("decode user: missing discord id")
	}

	role, err := s.mapDiscordRole(ctx, du.ID)
	if err != nil {
		return "", nil, err
	}

	// Upsert user, mapping configured Discord role IDs to local Pyxis roles.
	row, err := s.queries.UpsertUser(ctx, db.UpsertUserParams{
		DiscordID:       du.ID,
		DiscordUsername: du.Username,
		AvatarUrl:       pgtype.Text{String: du.Avatar, Valid: du.Avatar != ""},
		Role:            role,
	})
	if err != nil {
		return "", nil, fmt.Errorf("upsert user: %w", err)
	}

	// Create session
	sessionToken, err = s.createSession(ctx, row.ID)
	if err != nil {
		return "", nil, fmt.Errorf("create session: %w", err)
	}

	return sessionToken, &row, nil
}

func (s *AuthService) mapDiscordRole(ctx context.Context, discordUserID string) (string, error) {
	if !s.hasRoleMappingConfig() {
		return "staff", nil
	}
	if strings.TrimSpace(s.cfg.BotToken) == "" {
		return "", fmt.Errorf("discord role mapping requires discord-bot-token")
	}
	if strings.TrimSpace(s.cfg.GuildID) == "" {
		return "", fmt.Errorf("discord role mapping requires discord-guild-id")
	}

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
		return nil, fmt.Errorf("fetch guild member roles: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("discord user is not a member of configured guild")
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("fetch guild member roles: discord status %d", resp.StatusCode)
	}

	var member discordGuildMember
	if err := json.NewDecoder(resp.Body).Decode(&member); err != nil {
		return nil, fmt.Errorf("decode guild member roles: %w", err)
	}
	return member.Roles, nil
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
