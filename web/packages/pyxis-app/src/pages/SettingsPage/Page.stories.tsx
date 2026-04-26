import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Settings',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<SettingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

