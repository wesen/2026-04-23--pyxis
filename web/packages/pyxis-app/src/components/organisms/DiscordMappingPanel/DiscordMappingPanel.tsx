import type { DiscordChannelMapping } from 'pyxis-types';
import { DiscordChannelRow } from '../../molecules/DiscordChannelRow';
import { appPart } from '../../parts';
import './DiscordMappingPanel.css';
import { AppEmptyState } from '../../molecules/AppEmptyState';

export type DiscordMappingPanelProps = {
  mappings: DiscordChannelMapping[];
};

export function DiscordMappingPanel({ mappings }: DiscordMappingPanelProps) { return <div {...appPart('discord-mapping-panel')}>{mappings.length > 0 ? mappings.map((mapping)=><DiscordChannelRow key={mapping.kind} mapping={mapping}/>) : <AppEmptyState title="No Discord channels mapped yet." />}</div>; }
