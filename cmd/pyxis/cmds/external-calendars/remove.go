package external_calendars

import (
	"context"
	"fmt"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/types"
	"github.com/go-go-golems/pyxis/pkg/domain"
)

type RemoveCommand struct {
	*cmds.CommandDescription
}

type removeSettings struct {
	DBURL      string `glazed:"db-url"`
	CalendarID string `glazed:"calendar-id"`
}

func newRemoveCommand(dbURLFlag *fields.Definition) (*RemoveCommand, error) {
	sections, err := commonSections()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"remove",
		cmds.WithShort("Remove an external calendar by ID"),
		cmds.WithLong(`Remove a single external calendar from the configuration by its Google Calendar ID.

Examples:
  pyxis external-calendars remove --calendar-id "abc123@group.calendar.google.com"`),
		cmds.WithFlags(
			dbURLFlag,
			fields.New(
				"calendar-id",
				fields.TypeString,
				fields.WithHelp("Google Calendar ID to remove"),
			),
		),
		cmds.WithSections(sections...),
	)

	return &RemoveCommand{CommandDescription: cmdDesc}, nil
}

func (c *RemoveCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &removeSettings{}
	if err := vals.DecodeSectionInto("default", s); err != nil {
		return err
	}

	if s.CalendarID == "" {
		return fmt.Errorf("--calendar-id is required")
	}

	settings, repo, database, err := loadSettings(ctx, s.DBURL)
	if err != nil {
		return err
	}
	defer database.Close()

	// Filter out the calendar
	var remaining []domain.ExternalCalendarConfig
	for _, cal := range settings.ExternalCalendars {
		if cal.ID != s.CalendarID {
			remaining = append(remaining, cal)
		}
	}

	if len(remaining) == len(settings.ExternalCalendars) {
		return fmt.Errorf("calendar %q not found in configuration", s.CalendarID)
	}

	settings.ExternalCalendars = remaining
	_, err = repo.Update(ctx, settings)
	if err != nil {
		return fmt.Errorf("update settings: %w", err)
	}

	row := types.NewRow(
		types.MRP("action", "removed"),
		types.MRP("calendar-id", s.CalendarID),
		types.MRP("remaining", len(settings.ExternalCalendars)),
	)
	return gp.AddRow(ctx, row)
}
