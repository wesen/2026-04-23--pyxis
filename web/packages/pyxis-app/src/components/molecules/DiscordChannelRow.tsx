import type { DiscordChannelMapping } from 'pyxis-types';
import { appPart } from '../parts';
import './Rows.css';
export function DiscordChannelRow({ mapping }: { mapping: DiscordChannelMapping }) { return <div className="app-settings-row" {...appPart('discord-channel-row')}><div><strong>{mapping.label}</strong><span>{mapping.channelName} · {mapping.channelId}</span></div><b data-enabled={mapping.enabled}>{mapping.enabled ? 'Enabled' : 'Off'}</b></div>; }
