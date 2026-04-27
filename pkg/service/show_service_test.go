package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

func TestGetPublicByIDOnlyReturnsConfirmedUpcomingShows(t *testing.T) {
	today := time.Now().Truncate(24 * time.Hour)
	tests := []struct {
		name    string
		show    *domain.Show
		wantErr bool
	}{
		{name: "confirmed today", show: &domain.Show{ID: 1, Artist: "Today", Status: domain.StatusConfirmed, Date: today}},
		{name: "confirmed future", show: &domain.Show{ID: 1, Artist: "Future", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, 1)}},
		{name: "confirmed past hidden", show: &domain.Show{ID: 1, Artist: "Past", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, -1)}, wantErr: true},
		{name: "draft hidden", show: &domain.Show{ID: 1, Artist: "Draft", Status: domain.StatusDraft, Date: today.AddDate(0, 0, 1)}, wantErr: true},
		{name: "hold hidden", show: &domain.Show{ID: 1, Artist: "Hold", Status: domain.StatusHold, Date: today.AddDate(0, 0, 1)}, wantErr: true},
		{name: "blocked hidden", show: &domain.Show{ID: 1, Artist: "Blocked", Status: domain.StatusBlocked, Date: today.AddDate(0, 0, 1)}, wantErr: true},
		{name: "archived hidden", show: &domain.Show{ID: 1, Artist: "Archived", Status: domain.StatusArchived, Date: today.AddDate(0, 0, -30)}, wantErr: true},
		{name: "cancelled hidden", show: &domain.Show{ID: 1, Artist: "Cancelled", Status: domain.StatusCancelled, Date: today.AddDate(0, 0, 1)}, wantErr: true},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			svc := NewShowService(&fakeShowRepo{show: tc.show}, nil, nil)
			got, err := svc.GetPublicByID(context.Background(), 1)
			if tc.wantErr {
				if !errors.Is(err, ErrNotFound) {
					t.Fatalf("err = %v, want ErrNotFound", err)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected err: %v", err)
			}
			if got.Artist != tc.show.Artist {
				t.Fatalf("artist = %q, want %q", got.Artist, tc.show.Artist)
			}
		})
	}
}

type fakeShowRepo struct {
	show *domain.Show
	err  error
}

func (r *fakeShowRepo) ListUpcoming(ctx context.Context) ([]domain.Show, error) { return nil, nil }
func (r *fakeShowRepo) ListAll(ctx context.Context) ([]domain.Show, error)      { return nil, nil }
func (r *fakeShowRepo) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	if r.err != nil {
		return nil, r.err
	}
	if r.show == nil {
		return nil, ErrNotFound
	}
	return r.show, nil
}
func (r *fakeShowRepo) Create(ctx context.Context, show *domain.Show) (*domain.Show, error) {
	return show, nil
}
func (r *fakeShowRepo) Update(ctx context.Context, show *domain.Show) (*domain.Show, error) {
	return show, nil
}
func (r *fakeShowRepo) AttachDiscordMessage(ctx context.Context, id int, channelID, messageID string) (*domain.Show, error) {
	return r.show, nil
}
func (r *fakeShowRepo) GetByDiscordMessage(ctx context.Context, channelID, messageID string) (*domain.Show, error) {
	return r.show, nil
}
func (r *fakeShowRepo) ListExpiredConfirmed(ctx context.Context, before time.Time) ([]domain.Show, error) {
	return nil, nil
}
func (r *fakeShowRepo) Archive(ctx context.Context, id int) error { return nil }
func (r *fakeShowRepo) SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error) {
	return nil, nil
}
func (r *fakeShowRepo) GetArchiveStats(ctx context.Context) (*domain.ArchiveStats, error) {
	return nil, nil
}
