package cmds

import (
	"context"
	"encoding/csv"
	"fmt"
	"os"

	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/logging"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/settings"
	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/repository/postgres"
	"github.com/rs/zerolog/log"
)

type ExportCommand struct {
	*cmds.CommandDescription
}

type ExportSettings struct {
	DBURL    string `glazed:"db-url"`
	Format   string `glazed:"format"`
	OutFile  string `glazed:"outfile"`
	ShowType string `glazed:"type"`
}

func NewExportCommand() (*ExportCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, err
	}

	loggingSection, err := logging.NewLoggingSection()
	if err != nil {
		return nil, err
	}

	cmdDesc := cmds.NewCommandDescription(
		"export",
		cmds.WithShort("Export shows or submissions to CSV"),
		cmds.WithLong(`Export confirmed shows, archived shows, or submissions to a CSV file for reporting or migration.`),
		cmds.WithFlags(
			fields.New(
				"db-url",
				fields.TypeString,
				fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
				fields.WithHelp("PostgreSQL connection string"),
			),
			fields.New(
				"outfile",
				fields.TypeString,
				fields.WithDefault("-"),
				fields.WithHelp("Output file (- for stdout)"),
			),
			fields.New(
				"type",
				fields.TypeString,
				fields.WithDefault("shows"),
				fields.WithHelp("Export type: shows, archive, or submissions"),
			),
		),
		cmds.WithSections(glazedSection, loggingSection),
	)

	return &ExportCommand{CommandDescription: cmdDesc}, nil
}

func (c *ExportCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &ExportSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return err
	}

	database, err := db.Connect(ctx, s.DBURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer database.Close()

	queries := db.New(database.Pool)
	repo := postgres.NewShowRepo(queries, database.Pool)

	outfile := s.OutFile
	var out *csv.Writer
	if outfile == "-" {
		out = csv.NewWriter(os.Stdout)
	} else {
		f, err := os.Create(outfile)
		if err != nil {
			return fmt.Errorf("create output file: %w", err)
		}
		defer f.Close()
		out = csv.NewWriter(f)
	}
	defer out.Flush()

	switch s.ShowType {
	case "shows":
		shows, err := repo.ListAll(ctx)
		if err != nil {
			return fmt.Errorf("list shows: %w", err)
		}
		if err := out.Write([]string{"ID", "Artist", "Date", "Doors Time", "Status", "Genre", "Created At"}); err != nil {
			return err
		}
		for _, show := range shows {
			if err := out.Write([]string{
				fmt.Sprintf("%d", show.ID),
				show.Artist,
				show.Date.Format("2006-01-02"),
				show.DoorsTime,
				show.Status,
				show.Genre,
				show.CreatedAt.Format("2006-01-02"),
			}); err != nil {
				return err
			}
		}
		log.Info().Int("count", len(shows)).Msg("exported shows")

	case "archive":
		shows, err := repo.SearchArchive(ctx, "")
		if err != nil {
			return fmt.Errorf("list archive: %w", err)
		}
		if err := out.Write([]string{"ID", "Artist", "Date", "Genre", "Draw"}); err != nil {
			return err
		}
		for _, show := range shows {
			draw := ""
			if show.Draw > 0 {
				draw = fmt.Sprintf("%d", show.Draw)
			}
			if err := out.Write([]string{
				fmt.Sprintf("%d", show.ID),
				show.Artist,
				show.Date.Format("2006-01-02"),
				show.Genre,
				draw,
			}); err != nil {
				return err
			}
		}
		log.Info().Int("count", len(shows)).Msg("exported archive")

	default:
		return fmt.Errorf("unknown export type: %s", s.ShowType)
	}

	return nil
}
