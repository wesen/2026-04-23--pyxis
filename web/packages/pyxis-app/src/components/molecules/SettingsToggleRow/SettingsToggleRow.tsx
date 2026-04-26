import { appPart } from '../../parts';
import './SettingsToggleRow.css';
export function SettingsToggleRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) { return <div className="app-settings-row" {...appPart('settings-toggle-row')}><div><strong>{label}</strong><span>{description}</span></div><b data-enabled={enabled}>{enabled ? 'On' : 'Off'}</b></div>; }
