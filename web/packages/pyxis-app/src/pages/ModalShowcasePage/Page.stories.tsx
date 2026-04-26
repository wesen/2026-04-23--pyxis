import type { Meta, StoryObj } from '@storybook/react';
import { ModalShowcasePage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Modal Showcase',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<ModalShowcasePage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

