import { useState } from 'react';
import { Button } from 'pyxis-components';
import { SettingsToggleRow } from '../../molecules/SettingsToggleRow';
import { appPart } from '../../parts';
import './GCalSettingsSection.css';

export type ExternalCalendarEntry = {
  id: string;
  name: string;
  enabled: boolean;
};

export type GCalSettingsSectionProps = {
  enabled: boolean;
  calendarId: string;
  externalCalendars: ExternalCalendarEntry[];
  onToggleEnabled?: () => void;
  onUpdateCalendarId?: (id: string) => void;
  onAddExternalCalendar?: (id: string, name: string) => void;
  onRemoveExternalCalendar?: (id: string) => void;
  onToggleExternalCalendar?: (id: string, enabled: boolean) => void;
  canEdit?: boolean;
};

export function GCalSettingsSection({
  enabled,
  calendarId,
  externalCalendars,
  onToggleEnabled,
  onUpdateCalendarId,
  onAddExternalCalendar,
  onRemoveExternalCalendar,
  onToggleExternalCalendar,
  canEdit = true,
}: GCalSettingsSectionProps) {
  const [newCalId, setNewCalId] = useState('');
  const [newCalName, setNewCalName] = useState('');

  const handleAdd = () => {
    if (newCalId.trim() && newCalName.trim()) {
      onAddExternalCalendar?.(newCalId.trim(), newCalName.trim());
      setNewCalId('');
      setNewCalName('');
    }
  };

  return (
    <section {...appPart('gcal-settings-section')} data-enabled={enabled}>
      <h3>Google Calendar</h3>
      <div className="app-gcal-settings__content">
        <SettingsToggleRow
          label="Google Calendar sync"
          description="Push confirmed shows to a venue Google Calendar."
          enabled={enabled}
          onToggle={onToggleEnabled}
          disabled={!canEdit}
        />

        {enabled && (
          <>
            <div className="app-form-grid">
              <label>
                <span>Calendar ID</span>
                <input
                  disabled={!canEdit}
                  value={calendarId}
                  onChange={(e) => onUpdateCalendarId?.(e.target.value)}
                  placeholder="calendar@group.calendar.google.com"
                />
              </label>
            </div>

            <div className="app-gcal-external-list">
              <h4>External calendars</h4>
              <p className="app-gcal-external-hint">Events from these calendars appear on the public shows page.</p>

              {externalCalendars.length > 0 && (
                <ul className="app-gcal-external-entries">
                  {externalCalendars.map((cal) => (
                    <li key={cal.id} className="app-gcal-external-entry">
                      <div className="app-gcal-external-entry__info">
                        <strong>{cal.name}</strong>
                        <span className="app-gcal-external-entry__id">{cal.id}</span>
                      </div>
                      <div className="app-gcal-external-entry__actions">
                        <button
                          className="app-gcal-toggle"
                          data-enabled={cal.enabled}
                          onClick={() => onToggleExternalCalendar?.(cal.id, !cal.enabled)}
                          disabled={!canEdit}
                          type="button"
                        >
                          {cal.enabled ? 'On' : 'Off'}
                        </button>
                        <button
                          className="app-gcal-remove"
                          onClick={() => onRemoveExternalCalendar?.(cal.id)}
                          disabled={!canEdit}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {canEdit && (
                <div className="app-gcal-external-add">
                  <input
                    value={newCalId}
                    onChange={(e) => setNewCalId(e.target.value)}
                    placeholder="Calendar ID"
                  />
                  <input
                    value={newCalName}
                    onChange={(e) => setNewCalName(e.target.value)}
                    placeholder="Display name"
                  />
                  <Button onClick={handleAdd} disabled={!newCalId.trim() || !newCalName.trim()}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
