import type { Meta, StoryObj } from '@storybook/react';
import { ShowsPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Shows',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<ShowsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

