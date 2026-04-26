import type { DiscordChannelMapping } from 'pyxis-types';
import { DiscordChannelRow } from '../../molecules/DiscordChannelRow';
import { appPart } from '../../parts';
import './DiscordMappingPanel.css';
export function DiscordMappingPanel({ mappings }: { mappings: DiscordChannelMapping[] }) { return <div {...appPart('discord-mapping-panel')}>{mappings.map((mapping)=><DiscordChannelRow key={mapping.kind} mapping={mapping}/>)}</div>; }
