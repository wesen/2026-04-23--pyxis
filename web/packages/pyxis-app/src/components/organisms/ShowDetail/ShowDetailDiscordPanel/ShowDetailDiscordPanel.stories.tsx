import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetailDiscordPanel } from './ShowDetailDiscordPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowDetail/ShowDetailDiscordPanel',
  component: ShowDetailDiscordPanel,
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof ShowDetailDiscordPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DiscordPanel: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailDiscordPanel {...args}/></div>,
};

export const WithCallback: Story = {
  args: { onOpenPost: () => console.log('open discord post') },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailDiscordPanel {...args}/></div>,
};

export const NotPinned: Story = {
  args: { statusLabel: 'Posted · not pinned', reactionCount: 0 },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailDiscordPanel {...args}/></div>,
};
