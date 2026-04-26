import { appPart } from '../../parts';
import './SettingsToggleRow.css';

export type SettingsToggleRowProps = {
  label: string;
  description: string;
  enabled: boolean;
  onToggle?: () => void;
  disabled?: boolean;
};

export function SettingsToggleRow({ label, description, enabled, onToggle, disabled }: SettingsToggleRowProps) {
  return (
    <button className="app-settings-row" type="button" onClick={onToggle} disabled={disabled || !onToggle} {...appPart('settings-toggle-row')}>
      <div><strong>{label}</strong><span>{description}</span></div>
      <b data-enabled={enabled}>{enabled ? 'On' : 'Off'}</b>
    </button>
  );
}
