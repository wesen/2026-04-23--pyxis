package cmds

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

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
				fields.WithDefault("fixtures/dev.sql"),
				fields.WithHelp("Path to SQL fixtures file"),
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

	if strings.ToLower(filepath.Ext(s.Fixtures)) != ".sql" {
		return fmt.Errorf("unsupported fixtures file %q: only .sql fixtures are supported", s.Fixtures)
	}

	fixtureSQL, err := os.ReadFile(s.Fixtures)
	if err != nil {
		return fmt.Errorf("read fixtures %q: %w", s.Fixtures, err)
	}

	log.Info().Str("fixtures", s.Fixtures).Msg("loading SQL fixtures")
	if _, err := database.Pool.Exec(ctx, string(fixtureSQL)); err != nil {
		return fmt.Errorf("execute fixtures %q: %w", s.Fixtures, err)
	}

	counts, err := seedCounts(ctx, database)
	if err != nil {
		return err
	}

	fmt.Println("Seeded database from", s.Fixtures)
	for _, table := range seedCountTables() {
		fmt.Printf("%s=%d\n", table, counts[table])
	}
	return nil
}

func seedCounts(ctx context.Context, database *db.Pool) (map[string]int, error) {
	counts := map[string]int{}
	for _, table := range seedCountTables() {
		var count int
		if err := database.Pool.QueryRow(ctx, fmt.Sprintf("SELECT count(*) FROM %s", table)).Scan(&count); err != nil {
			return nil, fmt.Errorf("count %s: %w", table, err)
		}
		counts[table] = count
	}
	return counts, nil
}

func seedCountTables() []string {
	return []string{"users", "artists", "submissions", "shows", "calendar_holds", "calendar_blocked", "show_logs", "audit_log"}
}
