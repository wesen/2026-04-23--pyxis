package external_calendars

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/types"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/gcal"
	pgsettings "github.com/go-go-golems/pyxis/pkg/repository/postgres"
)

type SyncShowCommand struct {
	*cmds.CommandDescription
}

type syncShowSettings struct {
	DBURL       string `glazed:"db-url"`
	ShowID      int    `glazed:"show-id"`
	Credentials string `glazed:"credentials-file"`
	CalendarID  string `glazed:"calendar-id"`
}

func newSyncShowCommand(dbURLFlag *fields.Definition) (*SyncShowCommand, error) {
	sections, err := commonSections()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"sync-show",
		cmds.WithShort("Sync a show to Google Calendar"),
		cmds.WithLong(`Trigger Google Calendar sync for a single show.

Creates or updates the Google Calendar event for the show, then stores
the resulting event ID back in the database.

The GCal integration must be configured (service account credentials
and calendar ID) for this to work. The credentials file is the JSON
key file downloaded from Google Cloud Console.

Examples:
  pyxis external-calendars sync-show --show-id 42 \
    --credentials-file data/gcal/credentials.json \
    --calendar-id "pyxis@group.calendar.google.com"`),
		cmds.WithFlags(
			dbURLFlag,
			fields.New(
				"show-id",
				fields.TypeInteger,
				fields.WithHelp("Show ID to sync"),
			),
			fields.New(
				"credentials-file",
				fields.TypeString,
				fields.WithDefault("data/gcal/credentials.json"),
				fields.WithHelp("Path to service account JSON credentials file"),
			),
			fields.New(
				"calendar-id",
				fields.TypeString,
				fields.WithHelp("Google Calendar ID to sync to (overrides settings)"),
			),
		),
		cmds.WithSections(sections...),
	)

	return &SyncShowCommand{CommandDescription: cmdDesc}, nil
}

func (c *SyncShowCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &syncShowSettings{}
	if err := vals.DecodeSectionInto("default", s); err != nil {
		return err
	}

	if s.ShowID == 0 {
		return fmt.Errorf("--show-id is required")
	}

	// Load credentials
	creds, err := os.ReadFile(s.Credentials)
	if err != nil {
		return fmt.Errorf("read credentials %s: %w", s.Credentials, err)
	}

	// Connect to DB
	database, err := db.Connect(ctx, s.DBURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer database.Close()

	queries := db.New(database.Pool)
	showRepo := pgsettings.NewShowRepo(queries, database.Pool)
	settingsRepo := pgsettings.NewSettingsRepo(queries)

	// Load show
	show, err := showRepo.GetByID(ctx, s.ShowID)
	if err != nil {
		return fmt.Errorf("get show %d: %w", s.ShowID, err)
	}

	// Load settings for space name, address, website
	settings, err := settingsRepo.Get(ctx)
	if err != nil {
		return fmt.Errorf("get settings: %w", err)
	}

	// Determine calendar ID
	calID := s.CalendarID
	if calID == "" {
		calID = settings.GoogleCalID
	}
	if calID == "" {
		return fmt.Errorf("no calendar ID: set --calendar-id or configure google_cal_id in settings")
	}

	// Create GCal client
	client, err := gcal.NewClient(ctx, creds, calID)
	if err != nil {
		return fmt.Errorf("create gcal client: %w", err)
	}

	// Convert show to calendar event
	event := gcal.ShowToEvent(show, settings.SpaceName, settings.Address, settings.Website)

	var action, eventID string
	if show.GoogleCalEventID != "" {
		result, err := client.UpdateEvent(ctx, show.GoogleCalEventID, event)
		if err != nil {
			return fmt.Errorf("update event: %w", err)
		}
		eventID = result.EventID
		action = "updated"
	} else {
		result, err := client.CreateEvent(ctx, event)
		if err != nil {
			return fmt.Errorf("create event: %w", err)
		}
		eventID = result.EventID
		action = "created"

		// Save event ID back to DB
		_, err = showRepo.UpdateGoogleCalSync(ctx, show.ID, result.EventID, result.SyncedAt)
		if err != nil {
			return fmt.Errorf("save event ID: %w", err)
		}
	}

	row := types.NewRow(
		types.MRP("showId", show.ID),
		types.MRP("artist", show.Artist),
		types.MRP("date", show.Date.Format("2006-01-02")),
		types.MRP("action", action),
		types.MRP("eventId", eventID),
		types.MRP("calendarId", calID),
		types.MRP("syncedAt", time.Now().Format(time.RFC3339)),
	)
	return gp.AddRow(ctx, row)
}
