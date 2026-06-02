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

type SetCommand struct {
	*cmds.CommandDescription
}

type setSettings struct {
	DBURL     string   `glazed:"db-url"`
	Calendars []string `glazed:"calendar"`
	Replace   bool     `glazed:"replace"`
}

func newSetCommand(dbURLFlag *fields.Definition) (*SetCommand, error) {
	sections, err := commonSections()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"set",
		cmds.WithShort("Add or replace external calendars"),
		cmds.WithLong(`Add external Google Calendars to the configuration, or replace all existing ones.

Each --calendar flag takes the form "calendar-id=display-name".
By default, entries are appended to the existing list. Use --replace to
overwrite the entire list.

Examples:
  # Add two calendars (appended to existing)
  pyxis external-calendars set \
    --calendar "abc123@group.calendar.google.com=Neighbor Venue" \
    --calendar "def456@group.calendar.google.com=City Arts"

  # Replace all calendars with a new list
  pyxis external-calendars set --replace \
    --calendar "abc123@group.calendar.google.com=Neighbor Venue"

  # Remove all calendars
  pyxis external-calendars set --replace`),
		cmds.WithFlags(
			dbURLFlag,
			fields.New(
				"calendar",
				fields.TypeString,
				fields.WithHelp("Calendar entry in id=name format (repeatable)"),
			),
			fields.New(
				"replace",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Replace all calendars instead of appending"),
			),
		),
		cmds.WithSections(sections...),
	)

	return &SetCommand{CommandDescription: cmdDesc}, nil
}

func (c *SetCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &setSettings{}
	if err := vals.DecodeSectionInto("default", s); err != nil {
		return err
	}

	settings, repo, database, err := loadSettings(ctx, s.DBURL)
	if err != nil {
		return err
	}
	defer database.Close()

	// Build new entries from flags
	var newEntries []domain.ExternalCalendarConfig
	for _, raw := range s.Calendars {
		id, name, err := parseCalendarEntry(raw)
		if err != nil {
			return err
		}
		newEntries = append(newEntries, domain.ExternalCalendarConfig{
			ID:      id,
			Name:    name,
			Enabled: true,
		})
	}

	// Merge or replace
	if s.Replace {
		settings.ExternalCalendars = newEntries
	} else {
		// Append, but skip duplicates by ID
		existing := map[string]bool{}
		for _, cal := range settings.ExternalCalendars {
			existing[cal.ID] = true
		}
		for _, entry := range newEntries {
			if !existing[entry.ID] {
				settings.ExternalCalendars = append(settings.ExternalCalendars, entry)
			}
		}
	}

	_, err = repo.Update(ctx, settings)
	if err != nil {
		return fmt.Errorf("update settings: %w", err)
	}

	row := types.NewRow(
		types.MRP("action", "set"),
		types.MRP("count", len(settings.ExternalCalendars)),
		types.MRP("calendars", externalCalendarsToJSON(settings.ExternalCalendars)),
	)
	return gp.AddRow(ctx, row)
}
