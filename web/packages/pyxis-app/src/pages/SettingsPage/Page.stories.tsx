import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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

export const EditCoreSettingsMutation: Story = {
  render: () => renderWithFreshMockState(<SettingsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spaceName = await canvas.findByLabelText(/space name/i);
    await userEvent.clear(spaceName);
    await userEvent.type(spaceName, 'Story Space');
    const capacity = await canvas.findByLabelText(/capacity/i);
    await userEvent.clear(capacity);
    await userEvent.type(capacity, '222');
    await userEvent.click(await canvas.findByRole('button', { name: /save core settings/i }));
    await expect(await canvas.findByText(/Core settings updated/i)).toBeInTheDocument();
  },
};

