import type { Meta, StoryObj } from '@storybook/react';
import { discordMappings } from '../../../api/mockData';
import { DiscordChannelRow } from './DiscordChannelRow';

const meta = {
  title: 'Pyxis App/Components/Molecules/DiscordChannelRow',
  component: DiscordChannelRow,
  args: {
    mapping: discordMappings[0],
  },
} satisfies Meta<typeof DiscordChannelRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DiscordRowDefault: Story = {
  render: (args) => <div style={{ width: 520, padding: 24 }}><DiscordChannelRow {...args} /></div>,
};

export const Disabled: Story = {
  args: {
    mapping: discordMappings.find((mapping) => !mapping.enabled) ?? discordMappings[0],
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><DiscordChannelRow {...args} /></div>,
};

export const LongChannelId: Story = {
  args: {
    mapping: {
      ...discordMappings[0],
      label: 'Long-form booking request intake channel',
      channelName: '#booking-requests-long-form-and-follow-ups',
      channelId: '847392017483620358847392017483620358',
    },
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><DiscordChannelRow {...args} /></div>,
};

export const RowList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 0, width: 520, padding: 24 }}>
      {discordMappings.map((mapping) => <DiscordChannelRow key={mapping.kind} mapping={mapping} />)}
    </div>
  ),
};
