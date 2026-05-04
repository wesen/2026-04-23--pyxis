package gcal

import (
	"testing"
	"time"

	"github.com/go-go-golems/pyxis/pkg/domain"
)

func TestShowToEvent(t *testing.T) {
	date := time.Date(2026, 5, 10, 0, 0, 0, 0, time.UTC)

	tests := []struct {
		name          string
		show          *domain.Show
		spaceName     string
		address       string
		websiteURL    string
		wantSummary   string
		wantStart     string
		wantEnd       string
		wantLocation  string
		wantSourceURL string
	}{
		{
			name: "basic confirmed show",
			show: &domain.Show{
				ID:        42,
				Artist:    "Orphx",
				Date:      date,
				StartTime: "20:00",
				Price:     "$15",
				Age:       "21+",
				Genre:     "Industrial Techno",
			},
			spaceName:    "Pyxis",
			address:      "25 Manton Ave, Providence RI",
			websiteURL:   "https://pyxis.example.com",
			wantSummary:  "Orphx at Pyxis",
			wantStart:    "2026-05-10T20:00:00",
			wantEnd:      "2026-05-10T23:59:00",
			wantLocation: "25 Manton Ave, Providence RI",
			wantSourceURL: "https://pyxis.example.com/shows/42",
		},
		{
			name: "show with doors time uses doors time",
			show: &domain.Show{
				ID:         10,
				Artist:     "DJ Test",
				Date:       date,
				DoorsTime:  "19:00",
				StartTime:  "20:00",
				FlyerURL:   "/flyers/test.svg",
			},
			spaceName:    "Pyxis",
			address:      "25 Manton Ave",
			websiteURL:   "",
			wantSummary:  "DJ Test at Pyxis",
			wantStart:    "2026-05-10T19:00:00",
			wantEnd:      "2026-05-10T23:59:00",
			wantLocation: "25 Manton Ave",
		},
		{
			name: "no space name uses artist only",
			show: &domain.Show{
				ID:        5,
				Artist:    "Solo Artist",
				Date:      date,
				StartTime: "21:00",
			},
			spaceName:    "",
			address:      "",
			websiteURL:   "",
			wantSummary:  "Solo Artist",
			wantStart:    "2026-05-10T21:00:00",
			wantEnd:      "2026-05-10T23:59:00",
			wantLocation: "",
		},
		{
			name: "no start or doors time defaults to 19:00",
			show: &domain.Show{
				ID:     7,
				Artist: "Early Bird",
				Date:   date,
			},
			spaceName:    "Venue",
			address:      "123 Main St",
			websiteURL:   "https://example.com",
			wantSummary:  "Early Bird at Venue",
			wantStart:    "2026-05-10T19:00:00",
			wantEnd:      "2026-05-10T23:59:00",
			wantLocation: "123 Main St",
			wantSourceURL: "https://example.com/shows/7",
		},
		{
			name: "show with lineup in description",
			show: &domain.Show{
				ID:     99,
				Artist: "Headliner",
				Date:   date,
				Lineup: []domain.LineupEntry{
					{Artist: "Opener", Role: "support", StartTime: "19:00"},
					{Artist: "Headliner", Role: "headline", StartTime: "21:00"},
				},
			},
			spaceName:    "Pyxis",
			address:      "",
			websiteURL:   "",
			wantSummary:  "Headliner at Pyxis",
			wantStart:    "2026-05-10T19:00:00",
			wantEnd:      "2026-05-10T23:59:00",
			wantLocation: "",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			event := ShowToEvent(tc.show, tc.spaceName, tc.address, tc.websiteURL)

			if event.Summary != tc.wantSummary {
				t.Errorf("Summary = %q, want %q", event.Summary, tc.wantSummary)
			}
			if event.Start == nil {
				t.Fatal("Start is nil")
			}
			if event.Start.DateTime != tc.wantStart {
				t.Errorf("Start.DateTime = %q, want %q", event.Start.DateTime, tc.wantStart)
			}
			if event.Start.TimeZone != "America/New_York" {
				t.Errorf("Start.TimeZone = %q, want America/New_York", event.Start.TimeZone)
			}
			if event.End == nil {
				t.Fatal("End is nil")
			}
			if event.End.DateTime != tc.wantEnd {
				t.Errorf("End.DateTime = %q, want %q", event.End.DateTime, tc.wantEnd)
			}
			if event.Location != tc.wantLocation {
				t.Errorf("Location = %q, want %q", event.Location, tc.wantLocation)
			}
			if tc.wantSourceURL != "" {
				if event.Source == nil {
					t.Fatal("Source is nil, expected source URL")
				}
				if event.Source.Url != tc.wantSourceURL {
					t.Errorf("Source.Url = %q, want %q", event.Source.Url, tc.wantSourceURL)
				}
			}
			// Always check extended properties
			if event.ExtendedProperties == nil {
				t.Fatal("ExtendedProperties is nil")
			}
			if event.ExtendedProperties.Private["pyxisShowId"] != "42" && tc.show.ID == 42 {
				t.Errorf("pyxisShowId = %q, want %q", event.ExtendedProperties.Private["pyxisShowId"], "42")
			}
		})
	}
}

func TestShowToEventDescription(t *testing.T) {
	date := time.Date(2026, 6, 1, 0, 0, 0, 0, time.UTC)

	tests := []struct {
		name         string
		show         *domain.Show
		wantContains []string
	}{
		{
			name: "includes description and price",
			show: &domain.Show{
				ID:          1,
				Artist:      "Test",
				Date:        date,
				Description: "An amazing show",
				Price:       "$20",
				Age:         "21+",
				Genre:       "Techno",
			},
			wantContains: []string{"An amazing show", "Cover: $20", "Age: 21+", "Genre: Techno"},
		},
		{
			name: "includes lineup",
			show: &domain.Show{
				ID:     2,
				Artist: "Test",
				Date:   date,
				Lineup: []domain.LineupEntry{
					{Artist: "DJ One", Role: "support", StartTime: "19:00"},
					{Artist: "DJ Two", Role: "headline", StartTime: "21:00"},
				},
			},
			wantContains: []string{"Lineup:", "DJ One (support) — 19:00", "DJ Two (headline) — 21:00"},
		},
		{
			name: "empty show has minimal description",
			show: &domain.Show{
				ID:     3,
				Artist: "Minimal",
				Date:   date,
			},
			wantContains: []string{},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			event := ShowToEvent(tc.show, "", "", "")
			for _, want := range tc.wantContains {
				if event.Description == "" && len(tc.wantContains) == 0 {
					continue
				}
				found := false
				// Check if want is in the description
				for _, line := range splitLines(event.Description) {
					if line == want {
						found = true
						break
					}
				}
				if !found && len(tc.wantContains) > 0 {
					// Also check substring match for multi-word phrases
					if !contains(event.Description, want) {
						t.Errorf("Description missing %q\ngot: %q", want, event.Description)
					}
				}
			}
		})
	}
}

func TestFirstNonEmpty(t *testing.T) {
	tests := []struct {
		options []string
		want    string
	}{
		{options: []string{"20:00"}, want: "20:00"},
		{options: []string{"", "19:00"}, want: "19:00"},
		{options: []string{"", "", "18:00"}, want: "18:00"},
		{options: []string{}, want: "19:00"},
		{options: []string{"", "", ""}, want: "19:00"},
	}
	for _, tc := range tests {
		got := firstNonEmpty(tc.options...)
		if got != tc.want {
			t.Errorf("firstNonEmpty(%v) = %q, want %q", tc.options, got, tc.want)
		}
	}
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && (s == sub || len(sub) == 0 ||
		(len(s) > 0 && len(sub) > 0 && findSubstring(s, sub)))
}

func findSubstring(s, sub string) bool {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}

func splitLines(s string) []string {
	var lines []string
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == '\n' {
			lines = append(lines, s[start:i])
			start = i + 1
		}
	}
	if start < len(s) {
		lines = append(lines, s[start:])
	}
	return lines
}
