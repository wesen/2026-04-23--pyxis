package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/oauth2"
)

// DiscordOAuthConfig holds OAuth2 settings.
type DiscordOAuthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

// AuthService handles Discord OAuth and sessions.
type AuthService struct {
	queries *db.Queries
	oauth   *oauth2.Config
}

// NewAuthService creates a new AuthService.
func NewAuthService(queries *db.Queries, cfg DiscordOAuthConfig) *AuthService {
	return &AuthService{
		queries: queries,
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

// DiscordUser represents the user profile from Discord API.
type DiscordUser struct {
	ID            string `json:"id"`
	Username      string `json:"username"`
	Avatar        string `json:"avatar"`
	Discriminator string `json:"discriminator"`
}

// ExchangeCode exchanges an OAuth code for a user and creates a session.
func (s *AuthService) ExchangeCode(ctx context.Context, code string) (sessionToken string, user *db.User, err error) {
	token, err := s.oauth.Exchange(ctx, code)
	if err != nil {
		return "", nil, fmt.Errorf("exchange code: %w", err)
	}

	client := s.oauth.Client(ctx, token)
	resp, err := client.Get("https://discord.com/api/users/@me")
	if err != nil {
		return "", nil, fmt.Errorf("fetch user: %w", err)
	}
	defer resp.Body.Close()

	var du DiscordUser
	if err := json.NewDecoder(resp.Body).Decode(&du); err != nil {
		return "", nil, fmt.Errorf("decode user: %w", err)
	}

	// Upsert user
	row, err := s.queries.UpsertUser(ctx, db.UpsertUserParams{
		DiscordID:       du.ID,
		DiscordUsername: du.Username,
		AvatarUrl:       pgtype.Text{String: du.Avatar, Valid: du.Avatar != ""},
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
