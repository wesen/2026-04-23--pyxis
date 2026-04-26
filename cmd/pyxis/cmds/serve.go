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

type ServeCommand struct {
	*cmds.CommandDescription
}

type ServeSettings struct {
	Bind  string `glazed:"bind"`
	DBURL string `glazed:"db-url"`
}

func NewServeCommand() (*ServeCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"serve",
		cmds.WithShort("Start the Pyxis HTTP server"),
		cmds.WithLong(`Start the HTTP server that serves the public API, staff API, and auth endpoints.`),
		cmds.WithFlags(
			fields.New(
				"bind",
				fields.TypeString,
				fields.WithDefault("0.0.0.0:8080"),
				fields.WithHelp("Address to bind the HTTP server"),
			),
			fields.New(
				"db-url",
				fields.TypeString,
				fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
				fields.WithHelp("PostgreSQL connection string"),
			),
		),
		cmds.WithSections(glazedSection, loggingSection),
	)

	return &ServeCommand{CommandDescription: cmdDesc}, nil
}

func (c *ServeCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &ServeSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return err
	}

	log.Info().
		Str("bind", s.Bind).
		Str("db_url", s.DBURL).
		Msg("starting pyxis server (not yet implemented)")

	fmt.Println("Server would start on", s.Bind, "with DB", s.DBURL)
	return nil
}
