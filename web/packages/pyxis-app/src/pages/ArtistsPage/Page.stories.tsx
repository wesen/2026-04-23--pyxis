import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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

export const CreateArtistMutation: Story = {
  render: () => renderWithFreshMockState(<ArtistsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /new artist/i }));
    await userEvent.type(await canvas.findByLabelText(/^name$/i), 'Story Artist');
    await userEvent.type(await canvas.findByLabelText(/^genre$/i), 'Industrial');
    await userEvent.type(await canvas.findByLabelText(/^links$/i), 'https://example.test/story-artist');
    await userEvent.type(await canvas.findByLabelText(/^notes$/i), 'Created from a Storybook interaction.');
    await userEvent.click(await canvas.findByRole('button', { name: /create artist/i }));
    await expect(await canvas.findByText(/Artist created/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/Story Artist/i)).toBeInTheDocument();
  },
};

export const EditArtistMutation: Story = {
  render: () => renderWithFreshMockState(<ArtistsPage />),
  parameters: { viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(/Burial Hex/i));
    const notes = await canvas.findByLabelText(/^notes$/i);
    await userEvent.clear(notes);
    await userEvent.type(notes, 'Updated artist note from Storybook.');
    await userEvent.click(await canvas.findByRole('button', { name: /save artist/i }));
    await expect(await canvas.findByText(/Artist updated/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/Updated artist note from Storybook/i)).toBeInTheDocument();
  },
};

