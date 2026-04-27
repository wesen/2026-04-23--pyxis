package service

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

func TestSubmissionCreateValidation(t *testing.T) {
	tests := []struct {
		name    string
		sub     *domain.Submission
		wantErr bool
	}{
		{name: "valid visible public form", sub: &domain.Submission{ArtistName: "The Loud Project", Links: "https://example.com", Message: "Name: Ada\nEmail: ada@example.com\nShow type: Live music"}},
		{name: "missing artist", sub: &domain.Submission{Links: "https://example.com", Message: "hello"}, wantErr: true},
		{name: "missing links", sub: &domain.Submission{ArtistName: "Artist", Message: "hello"}, wantErr: true},
		{name: "artist too long", sub: &domain.Submission{ArtistName: strings.Repeat("a", 201)}, wantErr: true},
		{name: "links too long", sub: &domain.Submission{ArtistName: "Artist", Links: strings.Repeat("x", 2001)}, wantErr: true},
		{name: "message too long", sub: &domain.Submission{ArtistName: "Artist", Message: strings.Repeat("x", 5001)}, wantErr: true},
		{name: "tech rider too long", sub: &domain.Submission{ArtistName: "Artist", TechRider: strings.Repeat("x", 5001)}, wantErr: true},
		{name: "negative draw", sub: &domain.Submission{ArtistName: "Artist", ExpectedDraw: intPtr(-1)}, wantErr: true},
		{name: "draw too high", sub: &domain.Submission{ArtistName: "Artist", ExpectedDraw: intPtr(1001)}, wantErr: true},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			repo := &fakeSubmissionRepo{}
			svc := NewSubmissionService(repo, nil, nil, nil, nil)
			got, err := svc.Create(context.Background(), tc.sub)
			if tc.wantErr {
				if !errors.Is(err, ErrValidation) {
					t.Fatalf("err = %v, want ErrValidation", err)
				}
				if repo.created != nil {
					t.Fatalf("invalid submission was persisted: %#v", repo.created)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected err: %v", err)
			}
			if got == nil || got.ID != 123 {
				t.Fatalf("got = %#v, want created submission", got)
			}
			if repo.created == nil {
				t.Fatalf("valid submission was not passed to repository")
			}
		})
	}
}

func intPtr(v int) *int { return &v }

type fakeSubmissionRepo struct {
	created *domain.Submission
}

func (r *fakeSubmissionRepo) Create(ctx context.Context, s *domain.Submission) (*domain.Submission, error) {
	copy := *s
	copy.ID = 123
	r.created = &copy
	return &copy, nil
}
func (r *fakeSubmissionRepo) GetByID(ctx context.Context, id int) (*domain.Submission, error) {
	return nil, nil
}
func (r *fakeSubmissionRepo) List(ctx context.Context, status string) ([]domain.Submission, error) {
	return nil, nil
}
func (r *fakeSubmissionRepo) Approve(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error) {
	return nil, nil
}
func (r *fakeSubmissionRepo) Decline(ctx context.Context, id int, reviewedBy int) (*domain.Submission, error) {
	return nil, nil
}
func (r *fakeSubmissionRepo) UpdateDetails(ctx context.Context, submission *domain.Submission) (*domain.Submission, error) {
	return submission, nil
}
func (r *fakeSubmissionRepo) GetReview(ctx context.Context, submissionID int) (*domain.BookingReview, error) {
	return nil, nil
}
func (r *fakeSubmissionRepo) UpsertReview(ctx context.Context, review *domain.BookingReview) (*domain.BookingReview, error) {
	return review, nil
}
