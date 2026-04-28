import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import { create, ShowSchema, ShowStatus, toJson } from 'pyxis-types';
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

export const NotPostedDiscordState: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(await canvas.findByText(/Not posted yet/i)).toBeInTheDocument(); await expect(await canvas.findByRole('button', { name: /open post/i })).toBeDisabled(); },
};

export const PostedDiscordState: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' }, msw: { handlers: [http.get('*/api/app/shows/:id', () => HttpResponse.json(toJson(ShowSchema, create(ShowSchema, { id: 42, artist: 'Posted Artist', date: '2026-06-14', genre: 'Noise', status: ShowStatus.CONFIRMED, capacity: 150, discordChannelId: '123', discordMessageId: '456' }))))] } },
};

export const AnnounceFeedback: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/shows/:id" element={<ShowDetailPage />} />),
  parameters: { router: { initialEntries: ['/shows/42'] }, viewport: { defaultViewport: 'pyxisAppDesktop' } },
  play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(await canvas.findByRole('button', { name: /announce/i })); await expect(await canvas.findByText(/Announcement requested/i)).toBeInTheDocument(); },
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

