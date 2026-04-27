import { useEffect, useState } from 'react';
import type { Settings } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import './SettingsPanel.css';

export type CoreSettingsDraft = Pick<Settings, 'spaceName' | 'address' | 'capacity'>;

export type SettingsPanelProps = {
  settings: Settings;
  onSaveCoreSettings?: (draft: CoreSettingsDraft) => void;
  isUpdating?: boolean;
};

export function SettingsPanel({ settings, onSaveCoreSettings, isUpdating }: SettingsPanelProps) {
  const [draft, setDraft] = useState<CoreSettingsDraft>({ spaceName: settings.spaceName, address: settings.address, capacity: settings.capacity });

  useEffect(() => {
    setDraft({ spaceName: settings.spaceName, address: settings.address, capacity: settings.capacity });
  }, [settings]);

  return (
    <div {...appPart('settings-panel')}>
      <div className="app-settings-summary"><strong>{settings.spaceName}</strong><span>{settings.address} · {settings.capacity} cap · {settings.timezone || 'UTC'}</span></div>
      <div className="app-form-grid">
        <label><span>Space name</span><input value={draft.spaceName} onChange={(event) => setDraft((current) => ({ ...current, spaceName: event.target.value }))} /></label>
        <label><span>Address</span><textarea rows={3} value={draft.address} onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))} /></label>
        <label><span>Capacity</span><input type="number" min={0} value={draft.capacity || 0} onChange={(event) => setDraft((current) => ({ ...current, capacity: Number(event.target.value) }))} /></label>
      </div>
      <div className="app-detail-actions"><Button onClick={() => onSaveCoreSettings?.(draft)} isLoading={isUpdating} disabled={!draft.spaceName.trim()}>Save core settings</Button></div>
    </div>
  );
}
