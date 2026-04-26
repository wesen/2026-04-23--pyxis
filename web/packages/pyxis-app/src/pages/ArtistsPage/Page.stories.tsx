import type { Meta, StoryObj } from '@storybook/react';
import { ArtistsPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Artists',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<ArtistsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

