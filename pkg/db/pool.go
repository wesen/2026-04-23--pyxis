package db

import (
	"context"
	"database/sql"
	"embed"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/rs/zerolog/log"
)

//go:embed migrations/*.sql
var Migrations embed.FS

// Pool wraps a pgxpool.Pool with migration helpers.
type Pool struct {
	Pool    *pgxpool.Pool
	connStr string
}

// Connect opens a connection pool to PostgreSQL.
func Connect(ctx context.Context, databaseURL string) (*Pool, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse db config: %w", err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("create pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("ping db: %w", err)
	}

	log.Info().Str("host", config.ConnConfig.Host).Str("database", config.ConnConfig.Database).Msg("connected to postgresql")
	return &Pool{Pool: pool, connStr: databaseURL}, nil
}

// MigrateUp runs all pending migrations.
func (p *Pool) MigrateUp() error {
	sqlDB, err := sql.Open("pgx", p.connStr)
	if err != nil {
		return fmt.Errorf("open sql db: %w", err)
	}
	defer sqlDB.Close()

	src, err := iofs.New(Migrations, "migrations")
	if err != nil {
		return fmt.Errorf("create migration source: %w", err)
	}

	driver, err := pgx.WithInstance(sqlDB, &pgx.Config{})
	if err != nil {
		return fmt.Errorf("create migration driver: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", src, "pgx", driver)
	if err != nil {
		return fmt.Errorf("create migrator: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migrate up: %w", err)
	}

	version, dirty, _ := m.Version()
	log.Info().Uint("version", version).Bool("dirty", dirty).Msg("migrations applied")
	return nil
}

// MigrateDown rolls back one migration.
func (p *Pool) MigrateDown() error {
	sqlDB, err := sql.Open("pgx", p.connStr)
	if err != nil {
		return fmt.Errorf("open sql db: %w", err)
	}
	defer sqlDB.Close()

	src, err := iofs.New(Migrations, "migrations")
	if err != nil {
		return fmt.Errorf("create migration source: %w", err)
	}

	driver, err := pgx.WithInstance(sqlDB, &pgx.Config{})
	if err != nil {
		return fmt.Errorf("create migration driver: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", src, "pgx", driver)
	if err != nil {
		return fmt.Errorf("create migrator: %w", err)
	}

	if err := m.Steps(-1); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migrate down: %w", err)
	}

	version, dirty, _ := m.Version()
	log.Info().Uint("version", version).Bool("dirty", dirty).Msg("migrations rolled back")
	return nil
}

// Close closes the connection pool.
func (p *Pool) Close() {
	p.Pool.Close()
}
