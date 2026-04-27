import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ShowDetailPage } from '../Pages';
import { renderWithFreshMockState, RoutedPage } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Show Detail',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' } },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const EditShowMutation: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Burial Hex/i)).toBeInTheDocument();
    await userEvent.click(await canvas.findByRole('button', { name: /^edit$/i }));
    const artist = await canvas.findByLabelText(/artist \/ act name/i);
    await userEvent.clear(artist);
    await userEvent.type(artist, 'Burial Hex Edited');
    await userEvent.click(await canvas.findByRole('button', { name: /^save show$/i }));
    await expect(await canvas.findByText(/Show updated/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/Burial Hex Edited/i)).toBeInTheDocument();
  },
};

