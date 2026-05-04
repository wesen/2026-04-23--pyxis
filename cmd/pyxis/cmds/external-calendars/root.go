package external_calendars

import (
	"github.com/go-go-golems/glazed/pkg/cli"
	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/logging"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/go-go-golems/glazed/pkg/settings"
	"github.com/spf13/cobra"
)

// NewCommand returns the "external-calendars" cobra command group with subcommands.
func NewCommand() (*cobra.Command, error) {
	groupCmd := &cobra.Command{
		Use:   "external-calendars",
		Short: "Manage external Google Calendar sources",
		Long: `View and configure external Google Calendars whose events are displayed
on the public Pyxis shows page alongside venue shows.

Calendars are stored in the settings table as JSON. Each calendar has:
  - id:      Google Calendar ID (e.g. cal@group.calendar.google.com)
  - name:    Display name for the "Events Nearby" badge
  - enabled: Toggle without deleting the entry

Examples:
  pyxis external-calendars list --db-url postgres://...
  pyxis external-calendars set --calendar id=name --db-url postgres://...
  pyxis external-calendars remove <calendar-id> --db-url postgres://...`,
	}

	dbURLFlag := fields.New(
		"db-url",
		fields.TypeString,
		fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
		fields.WithHelp("PostgreSQL connection string"),
	)

	listCmd, err := newListCommand(dbURLFlag)
	if err != nil {
		return nil, err
	}

	setCmd, err := newSetCommand(dbURLFlag)
	if err != nil {
		return nil, err
	}

	removeCmd, err := newRemoveCommand(dbURLFlag)
	if err != nil {
		return nil, err
	}

	for _, cmd := range []cmds.Command{listCmd, setCmd, removeCmd} {
		cobraCmd, err := cli.BuildCobraCommandFromCommand(cmd)
		if err != nil {
			return nil, err
		}
		groupCmd.AddCommand(cobraCmd)
	}

	return groupCmd, nil
}

func commonSections() ([]schema.Section, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	return []schema.Section{glazedSection, loggingSection}, nil
}
