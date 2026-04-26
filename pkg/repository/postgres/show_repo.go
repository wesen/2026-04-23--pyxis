package postgres

import (
	"context"
	"fmt"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
)

// ShowRepo implements repository.ShowRepository using sqlc-generated queries.
type ShowRepo struct {
	queries *db.Queries
}

// NewShowRepo creates a new ShowRepo.
func NewShowRepo(queries *db.Queries) *ShowRepo {
	return &ShowRepo{queries: queries}
}

// ListUpcoming returns confirmed shows with date >= today.
func (r *ShowRepo) ListUpcoming(ctx context.Context) ([]domain.Show, error) {
	rows, err := r.queries.ListUpcomingShows(ctx)
	if err != nil {
		return nil, err
	}

	shows := make([]domain.Show, len(rows))
	for i, row := range rows {
		shows[i] = domain.Show{
			ID:          int(row.ID),
			Artist:      row.Artist,
			Date:        row.Date.Time,
			DoorsTime:   row.DoorsTime.String,
			StartTime:   row.StartTime.String,
			Age:         row.Age.String,
			Price:       row.Price.String,
			Genre:       row.Genre.String,
			Description: row.Description.String,
			FlyerURL:    row.FlyerUrl.String,
			Status:      row.Status,
			CreatedAt:   row.CreatedAt.Time,
			UpdatedAt:   row.UpdatedAt.Time,
		}
		if row.SubmissionID.Valid {
			v := int(row.SubmissionID.Int32)
			shows[i].SubmissionID = &v
		}
		if row.ArtistID.Valid {
			v := int(row.ArtistID.Int32)
			shows[i].ArtistID = &v
		}
	}
	return shows, nil
}

// GetByID returns a single show by ID.
func (r *ShowRepo) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	row, err := r.queries.GetShow(ctx, int32(id))
	if err != nil {
		return nil, err
	}

	show := &domain.Show{
		ID:          int(row.ID),
		Artist:      row.Artist,
		Date:        row.Date.Time,
		DoorsTime:   row.DoorsTime.String,
		StartTime:   row.StartTime.String,
		Age:         row.Age.String,
		Price:       row.Price.String,
		Genre:       row.Genre.String,
		Description: row.Description.String,
		FlyerURL:    row.FlyerUrl.String,
		Status:      row.Status,
		CreatedAt:   row.CreatedAt.Time,
		UpdatedAt:   row.UpdatedAt.Time,
	}
	if row.SubmissionID.Valid {
		v := int(row.SubmissionID.Int32)
		show.SubmissionID = &v
	}
	if row.ArtistID.Valid {
		v := int(row.ArtistID.Int32)
		show.ArtistID = &v
	}
	return show, nil
}

// SearchArchive returns archived shows matching the query.
func (r *ShowRepo) SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error) {
	rows, err := r.queries.SearchArchive(ctx, query)
	if err != nil {
		return nil, err
	}

	shows := make([]domain.ArchivedShow, len(rows))
	for i, row := range rows {
		shows[i] = domain.ArchivedShow{
			ID:     int(row.ID),
			Artist: row.Artist,
			Date:   row.Date.Time,
			Genre:  row.Genre.String,
			Draw:   int(row.Draw),
		}
	}
	return shows, nil
}

// GetArchiveStats returns aggregate stats for archived shows.
func (r *ShowRepo) GetArchiveStats(ctx context.Context) (*domain.ArchiveStats, error) {
	row, err := r.queries.GetArchiveStats(ctx)
	if err != nil {
		return nil, err
	}

	stats := &domain.ArchiveStats{
		TotalShows:    int(row.TotalShows),
		YearsRunning:  int(row.YearsRunning),
		UniqueArtists: int(row.UniqueArtists),
	}

	switch v := row.TotalAttendance.(type) {
	case int64:
		stats.TotalAttendance = int(v)
	case int32:
		stats.TotalAttendance = int(v)
	case float64:
		stats.TotalAttendance = int(v)
	default:
		return nil, fmt.Errorf("unexpected total_attendance type: %T", v)
	}

	return stats, nil
}
