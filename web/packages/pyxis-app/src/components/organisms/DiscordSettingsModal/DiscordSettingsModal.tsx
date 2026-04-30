import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import type { Settings } from 'pyxis-types';
import { Button, Field, Input, Modal } from 'pyxis-components';
import { ShowFormSection } from '../../molecules/ShowFormSection';
import { appPart } from '../../parts';
import './DiscordSettingsModal.css';

export type DiscordSettingsDraft = Pick<Settings,
  'discordChBookings' | 'discordChUpcoming' | 'discordChStaff' | 'discordChAnnouncements' | 'discordPosting'
>;

export type DiscordSettingsModalProps = {
  isOpen: boolean;
  settings: Settings;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (draft: DiscordSettingsDraft) => void;
};

function draftFromSettings(settings: Settings): DiscordSettingsDraft {
  return {
    discordChBookings: settings.discordChBookings,
    discordChUpcoming: settings.discordChUpcoming,
    discordChStaff: settings.discordChStaff,
    discordChAnnouncements: settings.discordChAnnouncements,
    discordPosting: settings.discordPosting,
  };
}

export function DiscordSettingsModal({ isOpen, settings, isSaving, onCancel, onSave }: DiscordSettingsModalProps) {
  const [draft, setDraft] = useState<DiscordSettingsDraft>(() => draftFromSettings(settings));

  useEffect(() => {
    if (isOpen) setDraft(draftFromSettings(settings));
  }, [isOpen, settings]);

  const set = <K extends keyof DiscordSettingsDraft>(key: K, value: DiscordSettingsDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Edit Discord settings"
      subtitle="Update channel mappings and posting behavior. Guild ID is managed by environment configuration."
      width="lg"
      bodyClassName="app-discord-settings-modal__body"
      panelProps={appPart('discord-settings-modal') as HTMLAttributes<HTMLDivElement>}
      footer={(
        <>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="button" onClick={() => onSave(draft)} isLoading={isSaving}>Save settings</Button>
        </>
      )}
    >
      <div className="app-discord-settings-modal">
        <ShowFormSection title="Runtime guild" description="Set DISCORD_GUILD_ID in the server environment. It is shown here for visibility, not edited in the database.">
          <div className="app-discord-settings-modal__single-field">
            <Field label="Guild ID" hint="Environment-managed">
              <Input value={settings.discordGuildId || 'Not configured'} disabled />
            </Field>
          </div>
        </ShowFormSection>
        <ShowFormSection title="Channel mappings" description="Use Discord channel IDs. The friendly names are display hints only until channel discovery is implemented.">
          <div className="app-discord-settings-modal__grid">
            <Field label="Bookings channel ID"><Input value={draft.discordChBookings} onChange={(event) => set('discordChBookings', event.target.value)} placeholder="1234567890" /></Field>
            <Field label="Upcoming channel ID"><Input value={draft.discordChUpcoming} onChange={(event) => set('discordChUpcoming', event.target.value)} placeholder="1234567890" /></Field>
            <Field label="Announcements channel ID"><Input value={draft.discordChAnnouncements} onChange={(event) => set('discordChAnnouncements', event.target.value)} placeholder="1234567890" /></Field>
            <Field label="Staff channel ID"><Input value={draft.discordChStaff} onChange={(event) => set('discordChStaff', event.target.value)} placeholder="1234567890" /></Field>
          </div>
        </ShowFormSection>
        <ShowFormSection title="Posting">
          <label className="app-discord-settings-modal__toggle"><input type="checkbox" checked={draft.discordPosting} onChange={(event) => set('discordPosting', event.target.checked)} /><span>Enable Discord posting for configured channels</span></label>
        </ShowFormSection>
      </div>
    </Modal>
  );
}
