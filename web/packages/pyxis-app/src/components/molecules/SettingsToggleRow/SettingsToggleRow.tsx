import { appPart } from '../../parts';
import './SettingsToggleRow.css';

export type SettingsToggleRowProps = {
  label: string;
  description: string;
  enabled: boolean;
};

export function SettingsToggleRow({ label, description, enabled }: SettingsToggleRowProps) { return <div className="app-settings-row" {...appPart('settings-toggle-row')}><div><strong>{label}</strong><span>{description}</span></div><b data-enabled={enabled}>{enabled ? 'On' : 'Off'}</b></div>; }
