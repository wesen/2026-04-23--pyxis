package service

import (
	"context"
	"fmt"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/repository"
)

// SubmissionService provides business logic for booking submissions.
type SubmissionService struct {
	submissions repository.SubmissionRepository
}

// NewSubmissionService creates a new SubmissionService.
func NewSubmissionService(submissions repository.SubmissionRepository) *SubmissionService {
	return &SubmissionService{submissions: submissions}
}

// Create validates and stores a new booking submission.
func (s *SubmissionService) Create(ctx context.Context, req *domain.Submission) (*domain.Submission, error) {
	if req.ArtistName == "" {
		return nil, fmt.Errorf("artist name is required")
	}
	if req.Links == "" {
		return nil, fmt.Errorf("links are required")
	}
	return s.submissions.Create(ctx, req)
}
