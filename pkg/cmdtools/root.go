package cmdtools

import (
	glazedcmds "github.com/go-go-golems/glazed/pkg/cmds"
	pyxiscmds "github.com/go-go-golems/pyxis/cmd/pyxis/cmds"
	extcal "github.com/go-go-golems/pyxis/cmd/pyxis/cmds/external-calendars"
	"github.com/spf13/cobra"
)

// NewCommandGroup returns all top-level Glazed commands for the pyxis CLI,
// plus any Cobra-only command groups.
func NewCommandGroup() ([]glazedcmds.Command, []CobraCommandGroup, error) {
	serveCmd, err := pyxiscmds.NewServeCommand()
	if err != nil {
		return nil, nil, err
	}

	migrateCmd, err := pyxiscmds.NewMigrateCommand()
	if err != nil {
		return nil, nil, err
	}

	seedCmd, err := pyxiscmds.NewSeedCommand()
	if err != nil {
		return nil, nil, err
	}

	exportCmd, err := pyxiscmds.NewExportCommand()
	if err != nil {
		return nil, nil, err
	}

	extCalGroup, err := extcal.NewCommand()
	if err != nil {
		return nil, nil, err
	}

	return []glazedcmds.Command{
			serveCmd,
			migrateCmd,
			seedCmd,
			exportCmd,
		}, []CobraCommandGroup{
			{Name: "external-calendars", Cmd: extCalGroup},
		}, nil
}

// CobraCommandGroup wraps a *cobra.Command that is added directly
// (not via Glazed's BuildCobraCommandFromCommand).
type CobraCommandGroup struct {
	Name string
	Cmd  *cobra.Command
}
