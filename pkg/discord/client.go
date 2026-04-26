package discord

import "context"

// Client is the interface for Discord interactions.
// A NoOpClient is used until the real bot is implemented.
type Client interface {
	AnnounceShow(ctx context.Context, showID int, artist string, date string) error
	UnpinAndNotifyCancellation(ctx context.Context, showID int, artist string) error
	NotifyArtist(ctx context.Context, discordID string, message string) error
	PostToChannel(ctx context.Context, channelID string, content string) error
}

// NoOpClient satisfies the Client interface without doing anything.
type NoOpClient struct{}

func (n *NoOpClient) AnnounceShow(ctx context.Context, showID int, artist string, date string) error {
	return nil
}

func (n *NoOpClient) UnpinAndNotifyCancellation(ctx context.Context, showID int, artist string) error {
	return nil
}

func (n *NoOpClient) NotifyArtist(ctx context.Context, discordID string, message string) error {
	return nil
}

func (n *NoOpClient) PostToChannel(ctx context.Context, channelID string, content string) error {
	return nil
}
