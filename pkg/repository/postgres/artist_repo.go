package postgres

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
)

// ArtistRepo implements repository.ArtistRepository using sqlc-generated queries.
type ArtistRepo struct {
	queries *db.Queries
}

// NewArtistRepo creates a new ArtistRepo.
func NewArtistRepo(queries *db.Queries) *ArtistRepo {
	return &ArtistRepo{queries: queries}
}

// List returns all artists ordered by name.
func (r *ArtistRepo) List(ctx context.Context) ([]domain.Artist, error) {
	rows, err := r.queries.ListArtists(ctx)
	if err != nil {
		return nil, err
	}

	artists := make([]domain.Artist, len(rows))
	for i, row := range rows {
		artists[i] = *dbArtistToDomain(row)
	}
	return artists, nil
}

// GetByID returns an artist by ID.
func (r *ArtistRepo) GetByID(ctx context.Context, id int) (*domain.Artist, error) {
	row, err := r.queries.GetArtist(ctx, int32(id))
	if err != nil {
		return nil, err
	}
	return dbArtistToDomain(row), nil
}

// GetByName returns an artist by exact name match.
func (r *ArtistRepo) GetByName(ctx context.Context, name string) (*domain.Artist, error) {
	row, err := r.queries.GetArtistByName(ctx, name)
	if err != nil {
		return nil, err
	}
	return dbArtistToDomain(row), nil
}

// Create inserts a new artist.
func (r *ArtistRepo) Create(ctx context.Context, artist *domain.Artist) (*domain.Artist, error) {
	params := db.CreateArtistParams{
		Name: artist.Name,
	}
	if artist.Genre != "" {
		params.Genre = pgtype.Text{String: artist.Genre, Valid: true}
	}
	if artist.Links != "" {
		params.Links = pgtype.Text{String: artist.Links, Valid: true}
	}
	if artist.Notes != "" {
		params.Notes = pgtype.Text{String: artist.Notes, Valid: true}
	}

	row, err := r.queries.CreateArtist(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbArtistToDomain(row), nil
}

// Update modifies an existing artist.
func (r *ArtistRepo) Update(ctx context.Context, artist *domain.Artist) (*domain.Artist, error) {
	params := db.UpdateArtistParams{
		ID:   int32(artist.ID),
		Name: artist.Name,
	}
	if artist.Genre != "" {
		params.Genre = pgtype.Text{String: artist.Genre, Valid: true}
	}
	if artist.Links != "" {
		params.Links = pgtype.Text{String: artist.Links, Valid: true}
	}
	if artist.Notes != "" {
		params.Notes = pgtype.Text{String: artist.Notes, Valid: true}
	}

	row, err := r.queries.UpdateArtist(ctx, params)
	if err != nil {
		return nil, err
	}
	return dbArtistToDomain(row), nil
}

func dbArtistToDomain(row db.Artist) *domain.Artist {
	return &domain.Artist{
		ID:        int(row.ID),
		Name:      row.Name,
		Genre:     row.Genre.String,
		Links:     row.Links.String,
		Notes:     row.Notes.String,
		CreatedAt: row.CreatedAt.Time,
		UpdatedAt: row.UpdatedAt.Time,
	}
}
