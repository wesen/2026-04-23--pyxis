package discordbot

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/discord-bot/pkg/framework"
)

func TestNewRunnerLoadsPyxisShowSpaceBot(t *testing.T) {
	scriptPath := filepath.Join("..", "..", "bot", "discord", "show-space", "index.js")
	runner, err := NewRunner(context.Background(), Config{
		Enabled:    true,
		ScriptPath: scriptPath,
		Credentials: framework.Credentials{
			BotToken:      "test-token",
			ApplicationID: "test-application",
		},
		RuntimeConfig: map[string]any{
			"upcomingShowsChannelId": "channel-upcoming",
			"adminRoleId":            "role-admin",
			"bookerRoleId":           "role-booker",
		},
	}, Deps{})
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}
	if runner == nil {
		t.Fatalf("NewRunner() returned nil runner")
	}
	if err := runner.Close(); err != nil {
		t.Fatalf("Close() error = %v", err)
	}
}
