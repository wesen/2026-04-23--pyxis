package cmds

import (
	"context"
	"fmt"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/logging"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/settings"
	"github.com/rs/zerolog/log"
)

type MigrateCommand struct {
	*cmds.CommandDescription
}

type MigrateSettings struct {
	DBURL string `glazed:"db-url"`
}

func NewMigrateCommand() (*MigrateCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"migrate",
		cmds.WithShort("Database migrations"),
		cmds.WithLong(`Run database migrations up or down.

Subcommands:
  up    - apply all pending migrations
  down  - rollback one migration`),
		cmds.WithFlags(
			fields.New(
				"db-url",
				fields.TypeString,
				fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
				fields.WithHelp("PostgreSQL connection string"),
			),
		),
		cmds.WithSections(glazedSection, loggingSection),
	)

	return &MigrateCommand{CommandDescription: cmdDesc}, nil
}

func (c *MigrateCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &MigrateSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return err
	}

	log.Info().Str("db_url", s.DBURL).Msg("migrate command (not yet implemented)")
	fmt.Println("Migrate would run against", s.DBURL)
	return nil
}
