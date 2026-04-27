import { discordMappings as seedMappings } from '../../api/mockData';
import { AppShell } from '../../components/shell';
import { DiscordMappingPanel, Panel } from '../../components/organisms/Panels';
import './Page.css';

export function DiscordPage() {
  return (
    <AppShell page="discord" title="Discord" eyebrow="Home / Discord">
      <Panel title="Channel mapping" section="discord-channel-mapping">
        <DiscordMappingPanel mappings={seedMappings} />
      </Panel>
    </AppShell>
  );
}
