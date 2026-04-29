package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

func TestGetPublicByIDOnlyReturnsConfirmedUpcomingShowsWithFlyers(t *testing.T) {
	today := time.Now().Truncate(24 * time.Hour)
	tests := []struct {
		name    string
		show    *domain.Show
		wantErr bool
	}{
		{name: "confirmed today with flyer", show: &domain.Show{ID: 1, Artist: "Today", Status: domain.StatusConfirmed, Date: today, FlyerURL: "/flyers/show-1/flyer.svg"}},
		{name: "confirmed future with flyer", show: &domain.Show{ID: 1, Artist: "Future", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}},
		{name: "confirmed future without flyer hidden", show: &domain.Show{ID: 1, Artist: "No Flyer", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, 1)}, wantErr: true},
		{name: "confirmed past hidden", show: &domain.Show{ID: 1, Artist: "Past", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, -1), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
		{name: "draft hidden", show: &domain.Show{ID: 1, Artist: "Draft", Status: domain.StatusDraft, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
		{name: "hold hidden", show: &domain.Show{ID: 1, Artist: "Hold", Status: domain.StatusHold, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
		{name: "blocked hidden", show: &domain.Show{ID: 1, Artist: "Blocked", Status: domain.StatusBlocked, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
		{name: "archived hidden", show: &domain.Show{ID: 1, Artist: "Archived", Status: domain.StatusArchived, Date: today.AddDate(0, 0, -30), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
		{name: "cancelled hidden", show: &domain.Show{ID: 1, Artist: "Cancelled", Status: domain.StatusCancelled, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}, wantErr: true},
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

func TestCreateAndUpdateRejectConfirmedShowsWithoutFlyers(t *testing.T) {
	today := time.Now().Truncate(24 * time.Hour)
	svc := NewShowService(&fakeShowRepo{}, noopAudit{}, nil)
	confirmedNoFlyer := &domain.Show{ID: 1, Artist: "No Flyer", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, 1)}
	if _, err := svc.Create(context.Background(), confirmedNoFlyer, 1, "tester"); err == nil {
		t.Fatalf("Create confirmed show without flyer succeeded, want error")
	}
	if _, err := svc.Update(context.Background(), confirmedNoFlyer, 1, "tester"); err == nil {
		t.Fatalf("Update confirmed show without flyer succeeded, want error")
	}
	confirmedWithFlyer := &domain.Show{ID: 1, Artist: "With Flyer", Status: domain.StatusConfirmed, Date: today.AddDate(0, 0, 1), FlyerURL: "/flyers/show-1/flyer.svg"}
	if _, err := svc.Create(context.Background(), confirmedWithFlyer, 1, "tester"); err != nil {
		t.Fatalf("Create confirmed show with flyer err = %v, want nil", err)
	}
}

func TestListUpcomingOnlyReturnsShowsWithFlyers(t *testing.T) {
	today := time.Now().Truncate(24 * time.Hour)
	repo := &fakeShowRepo{shows: []domain.Show{
		{ID: 1, Artist: "With Flyer", Status: domain.StatusConfirmed, Date: today, FlyerURL: "/flyers/show-1/flyer.svg"},
		{ID: 2, Artist: "No Flyer", Status: domain.StatusConfirmed, Date: today},
		{ID: 3, Artist: "Blank Flyer", Status: domain.StatusConfirmed, Date: today, FlyerURL: "   "},
	}}
	svc := NewShowService(repo, nil, nil)
	shows, err := svc.ListUpcoming(context.Background())
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if len(shows) != 1 || shows[0].ID != 1 {
		t.Fatalf("shows = %#v, want only show 1", shows)
	}
}

type fakeShowRepo struct {
	show  *domain.Show
	shows []domain.Show
	err   error
}

func (r *fakeShowRepo) ListUpcoming(ctx context.Context) ([]domain.Show, error) { return r.shows, nil }
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

type noopAudit struct{}

func (noopAudit) Log(ctx context.Context, actorID int, actorName, action, entityType string, entityID *int, metadata map[string]interface{}) error {
	return nil
}

func (noopAudit) List(ctx context.Context, limit, offset int) ([]domain.AuditLogEntry, error) {
	return nil, nil
}
