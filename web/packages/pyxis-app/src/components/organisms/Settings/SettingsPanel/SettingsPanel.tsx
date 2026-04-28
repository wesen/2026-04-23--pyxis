import { useEffect, useState } from 'react';
import type { Settings } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { appPart } from '../../../parts';
import './SettingsPanel.css';

export type CoreSettingsDraft = Pick<Settings,
  'spaceName' | 'tagline' | 'address' | 'capacity' | 'contactEmail' | 'bookingEmail' | 'website' | 'timezone' |
  'discordGuildId' | 'discordChUpcoming' | 'discordChAnnouncements' | 'discordChStaff' | 'discordChBookings' |
  'autoArchive' | 'discordPosting' | 'safeSpaceRequired' | 'setupComplete'
>;

export type SettingsPanelProps = {
  settings: Settings;
  onSaveCoreSettings?: (draft: CoreSettingsDraft) => void;
  isUpdating?: boolean;
  canEdit?: boolean;
};

function draftFromSettings(settings: Settings): CoreSettingsDraft {
  return {
    spaceName: settings.spaceName,
    tagline: settings.tagline,
    address: settings.address,
    capacity: settings.capacity,
    contactEmail: settings.contactEmail,
    bookingEmail: settings.bookingEmail,
    website: settings.website,
    timezone: settings.timezone,
    discordGuildId: settings.discordGuildId,
    discordChUpcoming: settings.discordChUpcoming,
    discordChAnnouncements: settings.discordChAnnouncements,
    discordChStaff: settings.discordChStaff,
    discordChBookings: settings.discordChBookings,
    autoArchive: settings.autoArchive,
    discordPosting: settings.discordPosting,
    safeSpaceRequired: settings.safeSpaceRequired,
    setupComplete: settings.setupComplete,
  };
}

export function SettingsPanel({ settings, onSaveCoreSettings, isUpdating, canEdit = true }: SettingsPanelProps) {
  const [draft, setDraft] = useState<CoreSettingsDraft>(draftFromSettings(settings));

  useEffect(() => { setDraft(draftFromSettings(settings)); }, [settings]);

  const set = <K extends keyof CoreSettingsDraft>(key: K, value: CoreSettingsDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const invalid = !draft.spaceName.trim() || (draft.capacity !== undefined && draft.capacity < 0);

  return (
    <div {...appPart('settings-panel')}>
      <div className="app-settings-summary"><strong>{settings.spaceName}</strong><span>{settings.address} · {settings.capacity} cap · {settings.timezone || 'UTC'}</span></div>
      {!canEdit && <div className="app-action-error" role="status">Read-only: admin role required to edit settings.</div>}
      <div className="app-settings-sections">
        <section>
          <h3>Space and public site</h3>
          <div className="app-form-grid">
            <label><span>Space name</span><input disabled={!canEdit} value={draft.spaceName} onChange={(event) => set('spaceName', event.target.value)} /></label>
            <label><span>Public tagline</span><input disabled={!canEdit} value={draft.tagline} onChange={(event) => set('tagline', event.target.value)} placeholder="Tiny room, loud calendar…" /></label>
            <label><span>Website</span><input disabled={!canEdit} value={draft.website} onChange={(event) => set('website', event.target.value)} placeholder="https://…" /></label>
            <label><span>Timezone</span><input disabled={!canEdit} value={draft.timezone} onChange={(event) => set('timezone', event.target.value)} placeholder="America/New_York" /></label>
            <label><span>Address</span><textarea disabled={!canEdit} rows={3} value={draft.address} onChange={(event) => set('address', event.target.value)} /></label>
            <label><span>Capacity</span><input disabled={!canEdit} type="number" min={0} value={draft.capacity || 0} onChange={(event) => set('capacity', Number(event.target.value))} /></label>
          </div>
        </section>
        <section>
          <h3>Booking and contact</h3>
          <div className="app-form-grid">
            <label><span>Contact email</span><input disabled={!canEdit} value={draft.contactEmail} onChange={(event) => set('contactEmail', event.target.value)} /></label>
            <label><span>Booking email</span><input disabled={!canEdit} value={draft.bookingEmail} onChange={(event) => set('bookingEmail', event.target.value)} /></label>
            <label className="app-settings-checkbox"><input disabled={!canEdit} type="checkbox" checked={draft.safeSpaceRequired} onChange={(event) => set('safeSpaceRequired', event.target.checked)} /><span>Require safer-space agreement in booking flow</span></label>
            <label className="app-settings-checkbox"><input disabled={!canEdit} type="checkbox" checked={draft.autoArchive} onChange={(event) => set('autoArchive', event.target.checked)} /><span>Auto-archive past shows</span></label>
            <label className="app-settings-checkbox"><input disabled={!canEdit} type="checkbox" checked={draft.setupComplete} onChange={(event) => set('setupComplete', event.target.checked)} /><span>Setup complete</span></label>
          </div>
        </section>
        <section>
          <h3>Discord</h3>
          <div className="app-form-grid">
            <label><span>Guild ID</span><input disabled={!canEdit} value={draft.discordGuildId} onChange={(event) => set('discordGuildId', event.target.value)} /></label>
            <label><span>Upcoming channel ID</span><input disabled={!canEdit} value={draft.discordChUpcoming} onChange={(event) => set('discordChUpcoming', event.target.value)} /></label>
            <label><span>Announcements channel ID</span><input disabled={!canEdit} value={draft.discordChAnnouncements} onChange={(event) => set('discordChAnnouncements', event.target.value)} /></label>
            <label><span>Staff channel ID</span><input disabled={!canEdit} value={draft.discordChStaff} onChange={(event) => set('discordChStaff', event.target.value)} /></label>
            <label><span>Bookings channel ID</span><input disabled={!canEdit} value={draft.discordChBookings} onChange={(event) => set('discordChBookings', event.target.value)} /></label>
            <label className="app-settings-checkbox"><input disabled={!canEdit} type="checkbox" checked={draft.discordPosting} onChange={(event) => set('discordPosting', event.target.checked)} /><span>Enable Discord posting</span></label>
          </div>
        </section>
      </div>
      {draft.capacity < 0 && <div className="app-action-error" role="alert">Capacity cannot be negative.</div>}
      <div className="app-detail-actions"><Button onClick={() => onSaveCoreSettings?.(draft)} isLoading={isUpdating} disabled={!canEdit || invalid}>Save settings</Button></div>
    </div>
  );
}
