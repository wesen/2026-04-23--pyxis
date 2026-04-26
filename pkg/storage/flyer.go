package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// FlyerStore is the interface for flyer image storage.
type FlyerStore interface {
	Upload(ctx context.Context, showID int, filename string, data io.Reader) (string, error)
	Delete(ctx context.Context, showID int, filename string) error
	URL(showID int, filename string) string
}

// LocalFlyerStore stores flyers on the local filesystem.
type LocalFlyerStore struct {
	BasePath string
	BaseURL  string
}

// NewLocalFlyerStore creates a new LocalFlyerStore.
func NewLocalFlyerStore(basePath, baseURL string) *LocalFlyerStore {
	return &LocalFlyerStore{BasePath: basePath, BaseURL: baseURL}
}

// Upload writes flyer data to disk.
func (s *LocalFlyerStore) Upload(ctx context.Context, showID int, filename string, data io.Reader) (string, error) {
	dir := filepath.Join(s.BasePath, fmt.Sprintf("show-%d", showID))
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("mkdir: %w", err)
	}

	// Sanitize filename
	filename = strings.ReplaceAll(filepath.Base(filename), "..", "")
	path := filepath.Join(dir, filename)

	f, err := os.Create(path)
	if err != nil {
		return "", fmt.Errorf("create file: %w", err)
	}
	defer f.Close()

	if _, err := io.Copy(f, data); err != nil {
		return "", fmt.Errorf("write file: %w", err)
	}

	return s.URL(showID, filename), nil
}

// Delete removes a flyer from disk.
func (s *LocalFlyerStore) Delete(ctx context.Context, showID int, filename string) error {
	filename = strings.ReplaceAll(filepath.Base(filename), "..", "")
	path := filepath.Join(s.BasePath, fmt.Sprintf("show-%d", showID), filename)
	return os.Remove(path)
}

// URL returns the public URL for a flyer.
func (s *LocalFlyerStore) URL(showID int, filename string) string {
	return fmt.Sprintf("%s/show-%d/%s", s.BaseURL, showID, filename)
}
