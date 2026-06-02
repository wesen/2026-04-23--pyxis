package external_calendars

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/types"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	pgsettings "github.com/go-go-golems/pyxis/pkg/repository/postgres"
)

type ListCommand struct {
	*cmds.CommandDescription
}

type listSettings struct {
	DBURL string `glazed:"db-url"`
}

func newListCommand(dbURLFlag *fields.Definition) (*ListCommand, error) {
	sections, err := commonSections()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"list",
		cmds.WithShort("List configured external calendars"),
		cmds.WithLong(`List all external Google Calendars currently configured in the database.

Shows the calendar ID, display name, and enabled status for each entry.

Examples:
  pyxis external-calendars list
  pyxis external-calendars list --output json`),
		cmds.WithFlags(dbURLFlag),
		cmds.WithSections(sections...),
	)

	return &ListCommand{CommandDescription: cmdDesc}, nil
}

func (c *ListCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &listSettings{}
	if err := vals.DecodeSectionInto("default", s); err != nil {
		return err
	}

	settings, _, database, err := loadSettings(ctx, s.DBURL)
	if err != nil {
		return err
	}
	defer database.Close()

	for _, cal := range settings.ExternalCalendars {
		row := types.NewRow(
			types.MRP("id", cal.ID),
			types.MRP("name", cal.Name),
			types.MRP("enabled", cal.Enabled),
			types.MRP("color", cal.Color),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}

	if len(settings.ExternalCalendars) == 0 {
		row := types.NewRow(
			types.MRP("id", "(none configured)"),
			types.MRP("name", ""),
			types.MRP("enabled", false),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}

	return nil
}

// loadSettings connects to the DB and loads the settings row.
func loadSettings(ctx context.Context, dbURL string) (*domain.Settings, *pgsettings.SettingsRepo, *db.Pool, error) {
	database, err := db.Connect(ctx, dbURL)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("connect to database: %w", err)
	}

	queries := db.New(database.Pool)
	repo := pgsettings.NewSettingsRepo(queries)

	settings, err := repo.Get(ctx)
	if err != nil {
		database.Close()
		return nil, nil, nil, fmt.Errorf("get settings: %w", err)
	}

	return settings, repo, database, nil
}

// parseCalendarEntry parses a "calendar-id=display-name" string.
func parseCalendarEntry(raw string) (string, string, error) {
	for i, ch := range raw {
		if ch == '=' {
			return raw[:i], raw[i+1:], nil
		}
	}
	return "", "", fmt.Errorf("invalid calendar entry %q: expected format id=name", raw)
}

// externalCalendarsToJSON is a helper for debugging output.
func externalCalendarsToJSON(cals []domain.ExternalCalendarConfig) string {
	b, _ := json.MarshalIndent(cals, "", "  ")
	return string(b)
}
