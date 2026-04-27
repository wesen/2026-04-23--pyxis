package service

import (
	"context"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// ArtistService provides business logic for artists.
type ArtistService struct {
	artists repository.ArtistRepository
}

// NewArtistService creates a new ArtistService.
func NewArtistService(artists repository.ArtistRepository) *ArtistService {
	return &ArtistService{artists: artists}
}

// List returns all artists.
func (s *ArtistService) List(ctx context.Context) ([]domain.Artist, error) {
	return s.artists.List(ctx)
}

// GetByID returns an artist by ID.
func (s *ArtistService) GetByID(ctx context.Context, id int) (*domain.Artist, error) {
	return s.artists.GetByID(ctx, id)
}

// Create inserts a new artist.
func (s *ArtistService) Create(ctx context.Context, artist *domain.Artist) (*domain.Artist, error) {
	return s.artists.Create(ctx, artist)
}

// Update modifies an existing artist.
func (s *ArtistService) Update(ctx context.Context, artist *domain.Artist) (*domain.Artist, error) {
	return s.artists.Update(ctx, artist)
}
