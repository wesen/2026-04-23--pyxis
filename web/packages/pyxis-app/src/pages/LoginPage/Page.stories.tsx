import type { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from '../Pages';

const meta: Meta = {
  title: 'Pyxis App/Pages/Login',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <LoginPage />,
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => <LoginPage />,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

