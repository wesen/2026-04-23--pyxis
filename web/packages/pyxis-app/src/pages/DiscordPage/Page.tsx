import { useState } from 'react';
import type { DiscordChannelMapping } from 'pyxis-types';
import { Button, Icon } from 'pyxis-components';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { DiscordMappingPanel, DiscordSettingsModal, Panel, type DiscordSettingsDraft } from '../../components/organisms';
import { ActionMessages, ErrorState, LoadingState } from '../shared';
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
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const openEditor = () => {
    setActionError(undefined);
    setActionSuccess(undefined);
    setEditorOpen(true);
  };

  const saveDiscordSettings = async (draft: DiscordSettingsDraft) => {
    if (!settings) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await updateSettings({ ...settings, ...draft }).unwrap();
      setEditorOpen(false);
      setActionSuccess('Discord settings updated.');
    } catch {
      setActionError('Could not update Discord settings. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="discord" title="Discord" eyebrow="Home / Discord">
      {isLoading ? <LoadingState label="Loading Discord settings from the backend…" /> : isError || !settings ? <ErrorState label="Could not load Discord settings." /> : (
        <div className="app-discord-layout">
          <ActionMessages error={actionError} success={actionSuccess} />
          <Panel
            title="Bot status"
            section="discord-bot-status"
            action={<Button type="button" variant="outline" size="sm" iconLeft="edit" onClick={openEditor}>Edit settings</Button>}
          >
            <div className="app-detail-list">
              <span>Guild ID <b>{settings.discordGuildId || 'Not configured'}</b></span>
              <span>Posting <b>{settings.discordPosting ? 'Enabled' : 'Disabled'}</b></span>
              <span>Setup <b>{settings.setupComplete ? 'Complete' : 'Incomplete'}</b></span>
            </div>
            <p className="app-muted-copy">Discord guild ID is runtime configuration from the server environment. Channel mappings and posting can be edited here.</p>
          </Panel>
          <Panel title="Channel mapping" section="discord-channel-mapping">
            <DiscordMappingPanel mappings={mappingsFromSettings(settings)} />
          </Panel>
          <Panel title="Schema note" section="discord-schema-note">
            <div className="app-discord-schema-note">
              <Icon name="cog" size={16} />
              <p>The current database stores channel IDs and the posting toggle. It does not yet model per-channel test-post status, role mappings, webhook IDs, sync timestamps, or bot health checks.</p>
            </div>
          </Panel>

          <DiscordSettingsModal
            isOpen={isEditorOpen}
            settings={settings}
            isSaving={updateState.isLoading}
            onCancel={() => setEditorOpen(false)}
            onSave={saveDiscordSettings}
          />
        </div>
      )}
    </AppShell>
  );
}
