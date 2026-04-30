import { useEffect, useState } from 'react';
import type { DiscordChannelMapping, Settings } from 'pyxis-types';
import { Button, Field, Icon, Input, Modal } from 'pyxis-components';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { DiscordMappingPanel, Panel } from '../../components/organisms';
import { ShowFormSection } from '../../components/molecules/ShowFormSection';
import { ActionMessages, ErrorState, LoadingState } from '../shared';
import './Page.css';

type DiscordSettingsDraft = Pick<Settings,
  'discordChBookings' | 'discordChUpcoming' | 'discordChStaff' | 'discordChAnnouncements' | 'discordPosting'
>;

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

function draftFromSettings(settings?: Settings): DiscordSettingsDraft {
  return {
    discordChBookings: settings?.discordChBookings ?? '',
    discordChUpcoming: settings?.discordChUpcoming ?? '',
    discordChStaff: settings?.discordChStaff ?? '',
    discordChAnnouncements: settings?.discordChAnnouncements ?? '',
    discordPosting: settings?.discordPosting ?? false,
  };
}

export function DiscordPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<DiscordSettingsDraft>(() => draftFromSettings(settings));
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (settings && !isEditorOpen) setDraft(draftFromSettings(settings));
  }, [settings, isEditorOpen]);

  const set = <K extends keyof DiscordSettingsDraft>(key: K, value: DiscordSettingsDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const openEditor = () => {
    setActionError(undefined);
    setActionSuccess(undefined);
    setDraft(draftFromSettings(settings));
    setEditorOpen(true);
  };

  const saveDiscordSettings = async () => {
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

          <Modal
            isOpen={isEditorOpen}
            onClose={() => setEditorOpen(false)}
            title="Edit Discord settings"
            subtitle="Update channel mappings and posting behavior. Guild ID is managed by environment configuration."
            width="lg"
            bodyClassName="app-discord-settings-modal__body"
            footer={(
              <>
                <Button type="button" variant="ghost" onClick={() => setEditorOpen(false)}>Cancel</Button>
                <Button type="button" onClick={saveDiscordSettings} isLoading={updateState.isLoading}>Save settings</Button>
              </>
            )}
          >
            <div className="app-discord-settings-modal">
              <ShowFormSection title="Runtime guild" description="Set DISCORD_GUILD_ID/PYXIS Discord guild config in the server environment. It is shown here for visibility, not edited in the database.">
                <Field label="Guild ID" hint="Environment-managed">
                  <Input value={settings.discordGuildId || 'Not configured'} disabled />
                </Field>
              </ShowFormSection>
              <ShowFormSection title="Channel mappings" description="Use Discord channel IDs. The friendly names are display hints only until channel discovery is implemented.">
                <div className="app-discord-settings-grid">
                  <Field label="Bookings channel ID"><Input value={draft.discordChBookings} onChange={(event) => set('discordChBookings', event.target.value)} placeholder="1234567890" /></Field>
                  <Field label="Upcoming channel ID"><Input value={draft.discordChUpcoming} onChange={(event) => set('discordChUpcoming', event.target.value)} placeholder="1234567890" /></Field>
                  <Field label="Announcements channel ID"><Input value={draft.discordChAnnouncements} onChange={(event) => set('discordChAnnouncements', event.target.value)} placeholder="1234567890" /></Field>
                  <Field label="Staff channel ID"><Input value={draft.discordChStaff} onChange={(event) => set('discordChStaff', event.target.value)} placeholder="1234567890" /></Field>
                </div>
              </ShowFormSection>
              <ShowFormSection title="Posting">
                <label className="app-discord-settings-toggle"><input type="checkbox" checked={draft.discordPosting} onChange={(event) => set('discordPosting', event.target.checked)} /><span>Enable Discord posting for configured channels</span></label>
              </ShowFormSection>
            </div>
          </Modal>
        </div>
      )}
    </AppShell>
  );
}
