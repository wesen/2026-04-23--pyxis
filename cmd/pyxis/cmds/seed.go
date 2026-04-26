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
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/rs/zerolog/log"
)

type SeedCommand struct {
	*cmds.CommandDescription
}

type SeedSettings struct {
	DBURL    string `glazed:"db-url"`
	Fixtures string `glazed:"fixtures"`
}

func NewSeedCommand() (*SeedCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"seed",
		cmds.WithShort("Seed the database with initial data"),
		cmds.WithLong(`Populate the database with sample shows, artists, and submissions for local development.`),
		cmds.WithFlags(
			fields.New(
				"db-url",
				fields.TypeString,
				fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
				fields.WithHelp("PostgreSQL connection string"),
			),
			fields.New(
				"fixtures",
				fields.TypeString,
				fields.WithDefault("fixtures/dev.yaml"),
				fields.WithHelp("Path to fixtures file"),
			),
		),
		cmds.WithSections(glazedSection, loggingSection),
	)

	return &SeedCommand{CommandDescription: cmdDesc}, nil
}

func (c *SeedCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &SeedSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return err
	}

	database, err := db.Connect(ctx, s.DBURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer database.Close()

	log.Info().Str("fixtures", s.Fixtures).Msg("seed command (not yet implemented)")
	fmt.Println("Seed would load fixtures from", s.Fixtures)
	return nil
}
