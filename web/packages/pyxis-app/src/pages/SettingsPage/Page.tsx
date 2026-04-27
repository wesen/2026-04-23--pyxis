import { useState } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { Panel, SettingsPanel } from '../../components/organisms/Panels';
import { ActionMessages, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function SettingsPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const toggleSetting = async (key: 'autoArchive' | 'discordPosting' | 'safeSpaceRequired') => {
    if (!settings) return;
    setActionError(undefined); setActionSuccess(undefined);
    try { await updateSettings({ ...settings, [key]: !settings[key] }).unwrap(); setActionSuccess('Settings updated.'); }
    catch { setActionError('Could not update settings. Check your session and backend logs.'); }
  };

  return (
    <AppShell page="settings" title="Settings" eyebrow="Home / Settings">
      {isLoading ? <LoadingState /> : isError || !settings ? <ErrorState /> : <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Space info" section="settings-space-info"><SettingsPanel settings={settings} isUpdating={updateState.isLoading} onToggleAutoArchive={() => toggleSetting('autoArchive')} onToggleDiscordPosting={() => toggleSetting('discordPosting')} onToggleSafeSpaceRequired={() => toggleSetting('safeSpaceRequired')} /></Panel></>}
    </AppShell>
  );
}
