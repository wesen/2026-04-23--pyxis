package cmdtools

import (
	glazedcmds "github.com/go-go-golems/glazed/pkg/cmds"
	pyxiscmds "github.com/go-go-golems/pyxis/cmd/pyxis/cmds"
)

// NewCommandGroup returns all top-level Glazed commands for the pyxis CLI.
func NewCommandGroup() ([]glazedcmds.Command, error) {
	serveCmd, err := pyxiscmds.NewServeCommand()
	if err != nil {
		return nil, err
	}

	migrateCmd, err := pyxiscmds.NewMigrateCommand()
	if err != nil {
		return nil, err
	}

	seedCmd, err := pyxiscmds.NewSeedCommand()
	if err != nil {
		return nil, err
	}

	return []glazedcmds.Command{
		serveCmd,
		migrateCmd,
		seedCmd,
	}, nil
}
