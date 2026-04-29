import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ShowLogPage } from '../Pages';
import { renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/ShowLog',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<ShowLogPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const OpenDetails: Story = {
  render: () => renderWithFreshMockState(<ShowLogPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click((await canvas.findAllByRole('button', { name: /details/i }))[0]);
    await expect(await canvas.findByText(/Show notes/i)).toBeInTheDocument();
  },
};

export const OpenEditor: Story = {
  render: () => renderWithFreshMockState(<ShowLogPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click((await canvas.findAllByRole('button', { name: /log|edit|review/i }))[0]);
    await expect(await canvas.findByRole('dialog')).toBeInTheDocument();
    await expect(await canvas.findByText(/Post-show notes/i)).toBeInTheDocument();
  },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<ShowLogPage />),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
