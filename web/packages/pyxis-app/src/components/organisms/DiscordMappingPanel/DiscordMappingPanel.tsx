import type { DiscordChannelMapping } from 'pyxis-types';
import { DiscordChannelRow } from '../../molecules/DiscordChannelRow';
import { appPart } from '../../parts';
import './DiscordMappingPanel.css';

export type DiscordMappingPanelProps = {
  mappings: DiscordChannelMapping[];
};

export function DiscordMappingPanel({ mappings }: DiscordMappingPanelProps) { return <div {...appPart('discord-mapping-panel')}>{mappings.length > 0 ? mappings.map((mapping)=><DiscordChannelRow key={mapping.kind} mapping={mapping}/>) : <p className="app-empty-state">No Discord channels mapped yet.</p>}</div>; }
