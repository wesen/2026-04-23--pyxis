import type { DiscordChannelMapping } from 'pyxis-types';
import { appPart } from '../../parts';
import '../SettingsToggleRow/SettingsToggleRow.css';

export type DiscordChannelRowProps = {
  mapping: DiscordChannelMapping;
};

export function DiscordChannelRow({ mapping }: DiscordChannelRowProps) { return <div className="app-settings-row" {...appPart('discord-channel-row')}><div><strong>{mapping.label}</strong><span>{mapping.channelName} · {mapping.channelId}</span></div><b data-enabled={mapping.enabled}>{mapping.enabled ? 'Enabled' : 'Off'}</b></div>; }
