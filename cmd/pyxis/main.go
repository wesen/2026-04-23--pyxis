package main

import (
	"context"

	"github.com/go-go-golems/glazed/pkg/cli"
	"github.com/go-go-golems/glazed/pkg/cmds/logging"
	"github.com/go-go-golems/glazed/pkg/help"
	help_cmd "github.com/go-go-golems/glazed/pkg/help/cmd"
	"github.com/go-go-golems/pyxis/pkg/cmdtools"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"
)

func main() {
	if err := run(); err != nil {
		log.Fatal().Err(err).Msg("pyxis failed")
	}
}

func run() error {
	rootCmd := &cobra.Command{
		Use:   "pyxis",
		Short: "Pyxis venue management backend",
		Long: `Pyxis is the backend for an independent music/arts venue.

It serves both the public-facing show site and the staff management app
from a single Go binary with PostgreSQL persistence.`,
		PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
			return logging.InitLoggerFromCobra(cmd)
		},
		SilenceUsage:  true,
		SilenceErrors: true,
	}

	if err := logging.AddLoggingSectionToRootCommand(rootCmd, "pyxis"); err != nil {
		return err
	}

	helpSystem := help.NewHelpSystem()
	help_cmd.SetupCobraRootCommand(helpSystem, rootCmd)

	commands, err := cmdtools.NewCommandGroup()
	if err != nil {
		return err
	}

	for _, cmd := range commands {
		cobraCmd, err := cli.BuildCobraCommandFromCommand(cmd)
		if err != nil {
			return err
		}
		rootCmd.AddCommand(cobraCmd)
	}

	ctx := context.Background()
	return rootCmd.ExecuteContext(ctx)
}
