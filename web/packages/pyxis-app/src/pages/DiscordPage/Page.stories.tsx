import type { Meta, StoryObj } from '@storybook/react';
import { DiscordPage } from '../Pages';

const meta: Meta = {
  title: 'Pyxis App/Pages/Discord',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <DiscordPage />,
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

