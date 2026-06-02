package gcal

import (
	"context"
	"fmt"
	"time"

	"github.com/go-go-golems/pyxis/pkg/domain"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

const calendarScope = "https://www.googleapis.com/auth/calendar"

// Client wraps the Google Calendar API service.
type Client struct {
	svc        *calendar.Service
	calendarID string // the venue's own calendar
}

// NewClient creates a Google Calendar client using service account credentials.
// Returns nil if credentialsJSON is empty (feature disabled).
func NewClient(ctx context.Context, credentialsJSON []byte, calendarID string) (*Client, error) {
	if len(credentialsJSON) == 0 || calendarID == "" {
		return nil, nil // not an error — feature is disabled
	}

	config, err := google.JWTConfigFromJSON(credentialsJSON, calendarScope)
	if err != nil {
		return nil, fmt.Errorf("parse service account credentials: %w", err)
	}

	svc, err := calendar.NewService(ctx, option.WithHTTPClient(config.Client(ctx)))
	if err != nil {
		return nil, fmt.Errorf("create calendar service: %w", err)
	}

	return &Client{svc: svc, calendarID: calendarID}, nil
}

// CalendarID returns the venue's Google Calendar ID.
func (c *Client) CalendarID() string {
	return c.calendarID
}

// CreateEvent creates a new event on the venue's Google Calendar.
func (c *Client) CreateEvent(ctx context.Context, event *calendar.Event) (*SyncResult, error) {
	created, err := c.svc.Events.Insert(c.calendarID, event).Context(ctx).Do()
	if err != nil {
		return nil, fmt.Errorf("create calendar event: %w", err)
	}
	return &SyncResult{EventID: created.Id, SyncedAt: time.Now()}, nil
}

// UpdateEvent updates an existing event on the venue's Google Calendar.
func (c *Client) UpdateEvent(ctx context.Context, eventID string, event *calendar.Event) (*SyncResult, error) {
	updated, err := c.svc.Events.Update(c.calendarID, eventID, event).Context(ctx).Do()
	if err != nil {
		return nil, fmt.Errorf("update calendar event: %w", err)
	}
	return &SyncResult{EventID: updated.Id, SyncedAt: time.Now()}, nil
}

// DeleteEvent removes an event from the venue's Google Calendar.
// Returns nil for 404 (event already gone).
func (c *Client) DeleteEvent(ctx context.Context, eventID string) error {
	err := c.svc.Events.Delete(c.calendarID, eventID).Context(ctx).Do()
	if err != nil {
		return fmt.Errorf("delete calendar event: %w", err)
	}
	return nil
}

// ListExternalEvents fetches events from an external Google Calendar.
func (c *Client) ListExternalEvents(ctx context.Context, calID string, timeMin, timeMax time.Time) ([]ExternalEvent, error) {
	events, err := c.svc.Events.List(calID).
		Context(ctx).
		TimeMin(timeMin.Format(time.RFC3339)).
		TimeMax(timeMax.Format(time.RFC3339)).
		SingleEvents(true).
		OrderBy("startTime").
		MaxResults(250).
		Do()
	if err != nil {
		return nil, fmt.Errorf("list events from %s: %w", calID, err)
	}

	result := make([]ExternalEvent, 0, len(events.Items))
	for _, e := range events.Items {
		ext := ExternalEvent{
			ID:          e.Id,
			CalendarID:  calID,
			Summary:     e.Summary,
			Description: e.Description,
			Location:    e.Location,
			URL:         e.HtmlLink,
		}

		if e.Start != nil {
			if e.Start.DateTime != "" {
				t, _ := time.Parse(time.RFC3339, e.Start.DateTime)
				ext.Start = t
			}
			if e.Start.Date != "" {
				t, _ := time.Parse(time.DateOnly, e.Start.Date)
				ext.Start = t
				ext.StartDate = e.Start.Date
				ext.IsAllDay = true
			}
		}
		if e.End != nil {
			if e.End.DateTime != "" {
				t, _ := time.Parse(time.RFC3339, e.End.DateTime)
				ext.End = t
			}
			if e.End.Date != "" {
				t, _ := time.Parse(time.DateOnly, e.End.Date)
				ext.End = t
				ext.EndDate = e.End.Date
			}
		}

		result = append(result, ext)
	}
	return result, nil
}

// ShowToEvent converts a Pyxis Show domain entity into a Google Calendar Event.
func ShowToEvent(show *domain.Show, spaceName, address, websiteURL string) *calendar.Event {
	var descParts []string
	if show.Description != "" {
		descParts = append(descParts, show.Description)
	}
	if len(show.Lineup) > 0 {
		descParts = append(descParts, "\nLineup:")
		for _, entry := range show.Lineup {
			line := fmt.Sprintf("  %s", entry.Artist)
			if entry.Role != "" {
				line += fmt.Sprintf(" (%s)", entry.Role)
			}
			if entry.StartTime != "" {
				line += fmt.Sprintf(" — %s", entry.StartTime)
			}
			descParts = append(descParts, line)
		}
	}
	if show.Price != "" {
		descParts = append(descParts, fmt.Sprintf("\nCover: %s", show.Price))
	}
	if show.Age != "" {
		descParts = append(descParts, fmt.Sprintf("Age: %s", show.Age))
	}
	if show.Genre != "" {
		descParts = append(descParts, fmt.Sprintf("Genre: %s", show.Genre))
	}

	tz := "America/New_York"
	dateStr := show.Date.Format("2006-01-02")

	startTime := dateStr + "T" + firstNonEmpty(show.DoorsTime, show.StartTime, "19:00") + ":00"
	endTime := dateStr + "T23:59:00"

	summary := show.Artist
	if spaceName != "" {
		summary = fmt.Sprintf("%s at %s", show.Artist, spaceName)
	}

	var source *calendar.EventSource
	if websiteURL != "" {
		source = &calendar.EventSource{
			Title: "Pyxis",
			Url:   fmt.Sprintf("%s/shows/%d", websiteURL, show.ID),
		}
	}

	return &calendar.Event{
		Summary:     summary,
		Location:    address,
		Description: joinNonEmpty(descParts, "\n"),
		Start: &calendar.EventDateTime{
			DateTime: startTime,
			TimeZone: tz,
		},
		End: &calendar.EventDateTime{
			DateTime: endTime,
			TimeZone: tz,
		},
		Source: source,
		ExtendedProperties: &calendar.EventExtendedProperties{
			Private: map[string]string{
				"pyxisShowId": fmt.Sprintf("%d", show.ID),
			},
		},
	}
}

func firstNonEmpty(options ...string) string {
	for _, s := range options {
		if s != "" {
			return s
		}
	}
	return "19:00"
}

func joinNonEmpty(parts []string, sep string) string {
	var nonEmpty []string
	for _, p := range parts {
		if p != "" {
			nonEmpty = append(nonEmpty, p)
		}
	}
	result := ""
	for i, s := range nonEmpty {
		if i > 0 {
			result += sep
		}
		result += s
	}
	return result
}
