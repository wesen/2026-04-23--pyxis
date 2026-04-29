package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-go-golems/pyxis/pkg/db"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ShowRepo implements repository.ShowRepository using sqlc-generated queries.
type ShowRepo struct {
	queries *db.Queries
	pool    *pgxpool.Pool
}

// NewShowRepo creates a new ShowRepo.
func NewShowRepo(queries *db.Queries, pool *pgxpool.Pool) *ShowRepo {
	return &ShowRepo{queries: queries, pool: pool}
}

// ListUpcoming returns confirmed shows with date >= today.
func (r *ShowRepo) ListUpcoming(ctx context.Context) ([]domain.Show, error) {
	rows, err := r.queries.ListUpcomingShows(ctx)
	if err != nil {
		return nil, err
	}

	shows := make([]domain.Show, len(rows))
	for i, row := range rows {
		shows[i] = upcomingRowToShow(row)
	}
	return shows, nil
}

// ListAll returns all shows.
func (r *ShowRepo) ListAll(ctx context.Context) ([]domain.Show, error) {
	rows, err := r.queries.ListAllShows(ctx)
	if err != nil {
		return nil, err
	}

	shows := make([]domain.Show, len(rows))
	for i, row := range rows {
		shows[i] = *rowToShow(row)
	}
	return shows, nil
}

// GetByID returns a single show by ID.
func (r *ShowRepo) GetByID(ctx context.Context, id int) (*domain.Show, error) {
	row, err := r.queries.GetShowWithLineup(ctx, int32(id))
	if err != nil {
		return nil, err
	}
	return rowWithLineupToShow(row)
}

// Create inserts a new show.
func (r *ShowRepo) Create(ctx context.Context, show *domain.Show) (*domain.Show, error) {
	params := db.CreateShowParams{
		Artist: show.Artist,
		Status: show.Status,
	}
	if !show.Date.IsZero() {
		params.Date = pgtype.Date{Time: show.Date, Valid: true}
	}
	if show.DoorsTime != "" {
		params.DoorsTime = pgtype.Text{String: show.DoorsTime, Valid: true}
	}
	if show.StartTime != "" {
		params.StartTime = pgtype.Text{String: show.StartTime, Valid: true}
	}
	if show.Age != "" {
		params.Age = pgtype.Text{String: show.Age, Valid: true}
	}
	if show.Price != "" {
		params.Price = pgtype.Text{String: show.Price, Valid: true}
	}
	if show.Genre != "" {
		params.Genre = pgtype.Text{String: show.Genre, Valid: true}
	}
	if show.Description != "" {
		params.Description = pgtype.Text{String: show.Description, Valid: true}
	}
	if show.Notes != "" {
		params.Notes = pgtype.Text{String: show.Notes, Valid: true}
	}
	if show.FlyerURL != "" {
		params.FlyerUrl = pgtype.Text{String: show.FlyerURL, Valid: true}
	}
	params.ReserveTicketEnabled = show.ReserveTicketEnabled
	params.Draw = pgtype.Int4{Int32: int32(show.Draw), Valid: true}
	params.Capacity = pgtype.Int4{Int32: int32(show.Capacity), Valid: true}
	if show.SubmissionID != nil {
		params.SubmissionID = pgtype.Int4{Int32: int32(*show.SubmissionID), Valid: true}
	}
	if show.ArtistID != nil {
		params.ArtistID = pgtype.Int4{Int32: int32(*show.ArtistID), Valid: true}
	}
	if show.CreatedBy != nil {
		params.CreatedBy = pgtype.Int4{Int32: int32(*show.CreatedBy), Valid: true}
	}
	if show.DiscordMessageID != "" {
		params.DiscordMessageID = pgtype.Text{String: show.DiscordMessageID, Valid: true}
	}
	if show.DiscordChannelID != "" {
		params.DiscordChannelID = pgtype.Text{String: show.DiscordChannelID, Valid: true}
	}

	if r.pool == nil {
		row, err := r.queries.CreateShow(ctx, params)
		if err != nil {
			return nil, err
		}
		if err := replaceShowLineup(ctx, r.queries, int(row.ID), show.Lineup); err != nil {
			return nil, err
		}
		return rowToShow(row), nil
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin create show transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	q := r.queries.WithTx(tx)
	row, err := q.CreateShow(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := replaceShowLineup(ctx, q, int(row.ID), show.Lineup); err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit create show transaction: %w", err)
	}
	return r.GetByID(ctx, int(row.ID))
}

// Update modifies an existing show.
func (r *ShowRepo) Update(ctx context.Context, show *domain.Show) (*domain.Show, error) {
	params := db.UpdateShowParams{
		ID:     int32(show.ID),
		Artist: show.Artist,
		Status: show.Status,
	}
	if !show.Date.IsZero() {
		params.Date = pgtype.Date{Time: show.Date, Valid: true}
	}
	if show.DoorsTime != "" {
		params.DoorsTime = pgtype.Text{String: show.DoorsTime, Valid: true}
	}
	if show.StartTime != "" {
		params.StartTime = pgtype.Text{String: show.StartTime, Valid: true}
	}
	if show.Age != "" {
		params.Age = pgtype.Text{String: show.Age, Valid: true}
	}
	if show.Price != "" {
		params.Price = pgtype.Text{String: show.Price, Valid: true}
	}
	if show.Genre != "" {
		params.Genre = pgtype.Text{String: show.Genre, Valid: true}
	}
	if show.Description != "" {
		params.Description = pgtype.Text{String: show.Description, Valid: true}
	}
	if show.Notes != "" {
		params.Notes = pgtype.Text{String: show.Notes, Valid: true}
	}
	params.FlyerUrl = pgtype.Text{String: show.FlyerURL, Valid: show.FlyerURL != ""}
	params.DiscordMessageID = pgtype.Text{String: show.DiscordMessageID, Valid: show.DiscordMessageID != ""}
	params.DiscordChannelID = pgtype.Text{String: show.DiscordChannelID, Valid: show.DiscordChannelID != ""}
	params.ReserveTicketEnabled = show.ReserveTicketEnabled
	params.Draw = pgtype.Int4{Int32: int32(show.Draw), Valid: true}
	params.Capacity = pgtype.Int4{Int32: int32(show.Capacity), Valid: true}

	if r.pool == nil {
		row, err := r.queries.UpdateShow(ctx, params)
		if err != nil {
			return nil, err
		}
		if err := replaceShowLineup(ctx, r.queries, int(row.ID), show.Lineup); err != nil {
			return nil, err
		}
		return rowToShow(row), nil
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin update show transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	q := r.queries.WithTx(tx)
	row, err := q.UpdateShow(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := replaceShowLineup(ctx, q, int(row.ID), show.Lineup); err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit update show transaction: %w", err)
	}
	return r.GetByID(ctx, int(row.ID))
}

// AttachDiscordMessage stores the Discord channel/message IDs for a show.
func (r *ShowRepo) AttachDiscordMessage(ctx context.Context, id int, channelID, messageID string) (*domain.Show, error) {
	row, err := r.queries.AttachDiscordMessageToShow(ctx, db.AttachDiscordMessageToShowParams{
		ID:               int32(id),
		DiscordChannelID: pgtype.Text{String: channelID, Valid: channelID != ""},
		DiscordMessageID: pgtype.Text{String: messageID, Valid: messageID != ""},
	})
	if err != nil {
		return nil, err
	}
	return rowToShow(row), nil
}

// GetByDiscordMessage returns the show associated with a Discord channel/message pair.
func (r *ShowRepo) GetByDiscordMessage(ctx context.Context, channelID, messageID string) (*domain.Show, error) {
	row, err := r.queries.GetShowByDiscordMessage(ctx, db.GetShowByDiscordMessageParams{
		DiscordChannelID: pgtype.Text{String: channelID, Valid: channelID != ""},
		DiscordMessageID: pgtype.Text{String: messageID, Valid: messageID != ""},
	})
	if err != nil {
		return nil, err
	}
	return rowToShow(row), nil
}

// ListExpiredConfirmed returns confirmed shows before the provided date.
func (r *ShowRepo) ListExpiredConfirmed(ctx context.Context, before time.Time) ([]domain.Show, error) {
	rows, err := r.queries.ListExpiredConfirmedShows(ctx, pgtype.Date{Time: before, Valid: true})
	if err != nil {
		return nil, err
	}
	shows := make([]domain.Show, len(rows))
	for i, row := range rows {
		shows[i] = *rowToShow(row)
	}
	return shows, nil
}

// Archive marks a show as archived.
func (r *ShowRepo) Archive(ctx context.Context, id int) error {
	_, err := r.queries.ArchiveShow(ctx, int32(id))
	return err
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
	}

	return stats, nil
}

func upcomingRowToShow(row db.ListUpcomingShowsRow) domain.Show {
	show := domain.Show{
		ID:                   int(row.ID),
		Artist:               row.Artist,
		Date:                 row.Date.Time,
		DoorsTime:            row.DoorsTime.String,
		StartTime:            row.StartTime.String,
		Age:                  row.Age.String,
		Price:                row.Price.String,
		Genre:                row.Genre.String,
		Description:          row.Description.String,
		Notes:                row.Notes.String,
		FlyerURL:             row.FlyerUrl.String,
		DiscordMessageID:     row.DiscordMessageID.String,
		DiscordChannelID:     row.DiscordChannelID.String,
		ReserveTicketEnabled: row.ReserveTicketEnabled,
		Draw:                 int(row.Draw.Int32),
		Capacity:             int(row.Capacity.Int32),
		Status:               row.Status,
		CreatedAt:            row.CreatedAt.Time,
		UpdatedAt:            row.UpdatedAt.Time,
	}
	if row.SubmissionID.Valid {
		v := int(row.SubmissionID.Int32)
		show.SubmissionID = &v
	}
	if row.ArtistID.Valid {
		v := int(row.ArtistID.Int32)
		show.ArtistID = &v
	}
	return show
}

func rowWithLineupToShow(row db.GetShowWithLineupRow) (*domain.Show, error) {
	show := &domain.Show{
		ID:                   int(row.ID),
		Artist:               row.Artist,
		Date:                 row.Date.Time,
		DoorsTime:            row.DoorsTime.String,
		StartTime:            row.StartTime.String,
		Age:                  row.Age.String,
		Price:                row.Price.String,
		Genre:                row.Genre.String,
		Description:          row.Description.String,
		Notes:                row.Notes.String,
		FlyerURL:             row.FlyerUrl.String,
		DiscordMessageID:     row.DiscordMessageID.String,
		DiscordChannelID:     row.DiscordChannelID.String,
		ReserveTicketEnabled: row.ReserveTicketEnabled,
		Draw:                 int(row.Draw.Int32),
		Capacity:             int(row.Capacity.Int32),
		Status:               row.Status,
		CreatedAt:            row.CreatedAt.Time,
		UpdatedAt:            row.UpdatedAt.Time,
	}
	if row.SubmissionID.Valid {
		v := int(row.SubmissionID.Int32)
		show.SubmissionID = &v
	}
	if row.ArtistID.Valid {
		v := int(row.ArtistID.Int32)
		show.ArtistID = &v
	}
	if row.CreatedBy.Valid {
		v := int(row.CreatedBy.Int32)
		show.CreatedBy = &v
	}
	lineup, err := decodeLineup(row.Lineup)
	if err != nil {
		return nil, err
	}
	show.Lineup = lineup
	return show, nil
}

func rowToShow(row db.Show) *domain.Show {
	show := &domain.Show{
		ID:                   int(row.ID),
		Artist:               row.Artist,
		Date:                 row.Date.Time,
		DoorsTime:            row.DoorsTime.String,
		StartTime:            row.StartTime.String,
		Age:                  row.Age.String,
		Price:                row.Price.String,
		Genre:                row.Genre.String,
		Description:          row.Description.String,
		Notes:                row.Notes.String,
		FlyerURL:             row.FlyerUrl.String,
		DiscordMessageID:     row.DiscordMessageID.String,
		DiscordChannelID:     row.DiscordChannelID.String,
		ReserveTicketEnabled: row.ReserveTicketEnabled,
		Draw:                 int(row.Draw.Int32),
		Capacity:             int(row.Capacity.Int32),
		Status:               row.Status,
		CreatedAt:            row.CreatedAt.Time,
		UpdatedAt:            row.UpdatedAt.Time,
	}
	if row.SubmissionID.Valid {
		v := int(row.SubmissionID.Int32)
		show.SubmissionID = &v
	}
	if row.ArtistID.Valid {
		v := int(row.ArtistID.Int32)
		show.ArtistID = &v
	}
	if row.CreatedBy.Valid {
		v := int(row.CreatedBy.Int32)
		show.CreatedBy = &v
	}
	return show
}

func replaceShowLineup(ctx context.Context, q *db.Queries, showID int, lineup []domain.LineupEntry) error {
	if err := q.DeleteShowLineup(ctx, int32(showID)); err != nil {
		return err
	}
	for i, entry := range lineup {
		if entry.Artist == "" {
			continue
		}
		params := db.CreateShowLineupEntryParams{
			ShowID:    int32(showID),
			Artist:    entry.Artist,
			Role:      entry.Role,
			SortOrder: int32(i),
		}
		if params.Role == "" {
			params.Role = "support"
		}
		if entry.StartTime != "" {
			params.StartTime = pgtype.Text{String: entry.StartTime, Valid: true}
		}
		if entry.EndTime != "" {
			params.EndTime = pgtype.Text{String: entry.EndTime, Valid: true}
		}
		if _, err := q.CreateShowLineupEntry(ctx, params); err != nil {
			return err
		}
	}
	return nil
}

func decodeLineup(raw interface{}) ([]domain.LineupEntry, error) {
	if raw == nil {
		return nil, nil
	}
	var data []byte
	switch v := raw.(type) {
	case []byte:
		data = v
	case string:
		data = []byte(v)
	default:
		data, _ = json.Marshal(v)
	}
	if len(data) == 0 {
		return nil, nil
	}
	var rows []struct {
		Artist    string `json:"artist"`
		Role      string `json:"role"`
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
	}
	if err := json.Unmarshal(data, &rows); err != nil {
		return nil, fmt.Errorf("decode show lineup: %w", err)
	}
	lineup := make([]domain.LineupEntry, 0, len(rows))
	for _, row := range rows {
		lineup = append(lineup, domain.LineupEntry{
			Artist:    row.Artist,
			Role:      row.Role,
			StartTime: row.StartTime,
			EndTime:   row.EndTime,
		})
	}
	return lineup, nil
}
