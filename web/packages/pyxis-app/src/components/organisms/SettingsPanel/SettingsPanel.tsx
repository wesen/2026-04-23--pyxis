import type { Settings } from 'pyxis-types';
import { SettingsToggleRow } from '../../molecules/SettingsToggleRow';
import { appPart } from '../../parts';
import './SettingsPanel.css';

export type SettingsPanelProps = {
  settings: Settings;
};

export function SettingsPanel({ settings }: SettingsPanelProps) { return <div {...appPart('settings-panel')}><div className="app-settings-summary"><strong>{settings.spaceName}</strong><span>{settings.address} · {settings.capacity} cap · {settings.contactEmail}</span></div><SettingsToggleRow label="Auto archive past shows" description="Move completed shows to archive after their date." enabled={true}/><SettingsToggleRow label="Discord posting" description="Post approved events and booking activity to mapped channels." enabled={true}/><SettingsToggleRow label="Safer-space agreement" description="Require agreement text before confirming public bookings." enabled={false}/></div>; }
