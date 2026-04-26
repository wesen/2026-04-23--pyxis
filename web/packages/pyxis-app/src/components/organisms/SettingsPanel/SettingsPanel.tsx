import type { SpaceSettings } from 'pyxis-types';
import { SettingsToggleRow } from '../../molecules/SettingsToggleRow';
import { appPart } from '../../parts';
import './SettingsPanel.css';

export type SettingsPanelProps = {
  settings: SpaceSettings;
};

export function SettingsPanel({ settings }: SettingsPanelProps) { return <div {...appPart('settings-panel')}><div className="app-settings-summary"><strong>{settings.name}</strong><span>{settings.address} · {settings.capacity} cap · {settings.timezone}</span></div><SettingsToggleRow label="Auto archive past shows" description="Move completed shows to archive after their date." enabled={settings.autoArchive}/><SettingsToggleRow label="Discord posting" description="Post approved events and booking activity to mapped channels." enabled={settings.discordPosting}/><SettingsToggleRow label="Safer-space agreement" description="Require agreement text before confirming public bookings." enabled={settings.safeSpaceRequired}/></div>; }
