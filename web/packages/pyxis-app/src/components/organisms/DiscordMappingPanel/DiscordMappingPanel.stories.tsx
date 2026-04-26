import type { Meta, StoryObj } from '@storybook/react';
import { discordMappings } from '../../../api/mockData';
import { DiscordMappingPanel } from './DiscordMappingPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/DiscordMappingPanel',
  component: DiscordMappingPanel,
  parameters: { layout: 'fullscreen' },
  args: { mappings: discordMappings },
} satisfies Meta<typeof DiscordMappingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><DiscordMappingPanel {...args} /></div>,
};

export const Empty: Story = {
  args: { mappings: [] },
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><DiscordMappingPanel {...args} /></div>,
};

export const DisabledIncluded: Story = {
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><DiscordMappingPanel {...args} /></div>,
};
