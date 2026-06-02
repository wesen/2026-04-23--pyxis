import { useState } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { Panel, SettingsPanel } from '../../components/organisms';
import type { CoreSettingsDraft, GCalSettingsDraft } from '../../components/organisms/Settings/SettingsPanel/SettingsPanel';
import { ActionMessages, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function SettingsPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const saveCoreSettings = async (draft: CoreSettingsDraft) => {
    if (!settings) return;
    setActionError(undefined); setActionSuccess(undefined);
    if (!draft.spaceName.trim()) { setActionError('Space name is required.'); return; }
    if (draft.capacity < 0) { setActionError('Capacity cannot be negative.'); return; }
    try { await updateSettings({ ...settings, ...draft }).unwrap(); setActionSuccess('Settings updated.'); }
    catch { setActionError('Could not update settings. Check your session and backend logs.'); }
  };

  const saveGCalSettings = async (gcal: GCalSettingsDraft) => {
    if (!settings) return;
    setActionError(undefined); setActionSuccess(undefined);
    try {
      await updateSettings({
        ...settings,
        googleCalEnabled: gcal.enabled,
        googleCalId: gcal.calendarId,
        externalCalendarsJson: JSON.stringify(gcal.externalCalendars),
      }).unwrap();
      setActionSuccess('Google Calendar settings updated.');
    } catch {
      setActionError('Could not update Google Calendar settings. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="settings" title="Settings" eyebrow="Home / Settings">
      {isLoading ? <LoadingState /> : isError || !settings ? <ErrorState /> : <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Settings" section="settings-space-info"><SettingsPanel settings={settings} isUpdating={updateState.isLoading} onSaveCoreSettings={saveCoreSettings} onSaveGCalSettings={saveGCalSettings} /></Panel></>}
    </AppShell>
  );
}
