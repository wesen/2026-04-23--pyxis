import type { Meta, StoryObj } from '@storybook/react';
import { SetupPage } from '../Pages';

const meta: Meta = {
  title: 'Pyxis App/Pages/Setup',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <SetupPage />,
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

