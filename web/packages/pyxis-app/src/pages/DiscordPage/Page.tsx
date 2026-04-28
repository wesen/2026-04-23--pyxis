import type { DiscordChannelMapping } from 'pyxis-types';
import { useGetSettingsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { DiscordMappingPanel, Panel } from '../../components/organisms';
import { ErrorState, LoadingState } from '../shared';
import './Page.css';

function channelName(id: string, fallback: string) {
  return id ? `#${fallback}` : fallback;
}

function mappingsFromSettings(settings: NonNullable<ReturnType<typeof useGetSettingsQuery>['data']>): DiscordChannelMapping[] {
  return [
    { kind: 'bookingRequests', label: 'Booking requests', channelName: channelName(settings.discordChBookings, 'booking-requests'), channelId: settings.discordChBookings, enabled: Boolean(settings.discordChBookings && settings.discordPosting) },
    { kind: 'upcomingShows', label: 'Upcoming shows', channelName: channelName(settings.discordChUpcoming, 'upcoming-shows'), channelId: settings.discordChUpcoming, enabled: Boolean(settings.discordChUpcoming && settings.discordPosting) },
    { kind: 'staffLog', label: 'Staff log', channelName: channelName(settings.discordChStaff, 'staff'), channelId: settings.discordChStaff, enabled: Boolean(settings.discordChStaff && settings.discordPosting) },
    { kind: 'postShowLog', label: 'Announcements', channelName: channelName(settings.discordChAnnouncements, 'announcements'), channelId: settings.discordChAnnouncements, enabled: Boolean(settings.discordChAnnouncements && settings.discordPosting) },
  ];
}

export function DiscordPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  return (
    <AppShell page="discord" title="Discord" eyebrow="Home / Discord">
      {isLoading ? <LoadingState label="Loading Discord settings from the backend…" /> : isError || !settings ? <ErrorState label="Could not load Discord settings." /> : (
        <div className="app-discord-layout">
          <Panel title="Bot status" section="discord-bot-status">
            <div className="app-detail-list">
              <span>Guild ID <b>{settings.discordGuildId || 'Not configured'}</b></span>
              <span>Posting <b>{settings.discordPosting ? 'Enabled' : 'Disabled'}</b></span>
              <span>Setup <b>{settings.setupComplete ? 'Complete' : 'Incomplete'}</b></span>
            </div>
            <p className="app-muted-copy">Channel mappings are read from backend settings. Editing and test-post actions are tracked in the OSHA backlog.</p>
          </Panel>
          <Panel title="Channel mapping" section="discord-channel-mapping">
            <DiscordMappingPanel mappings={mappingsFromSettings(settings)} />
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
