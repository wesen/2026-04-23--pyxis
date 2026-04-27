import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { BookingReviewPage } from '../Pages';
import { RoutedPage, renderWithFreshMockState } from '../storybook';

const meta: Meta = {
  title: 'Pyxis App/Pages/Booking Review',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/bookings/review/:id" element={<BookingReviewPage />} />),
  parameters: {
    router: { initialEntries: ['/bookings/review/1'] },
    viewport: { defaultViewport: 'pyxisAppDesktop' },
  },
};

export const Mobile: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/bookings/review/:id" element={<BookingReviewPage />} />),
  parameters: {
    router: { initialEntries: ['/bookings/review/1'] },
    viewport: { defaultViewport: 'pyxisAppMobile' },
  },
};

export const SaveBookingDetailsMutation: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/bookings/review/:id" element={<BookingReviewPage />} />),
  parameters: {
    router: { initialEntries: ['/bookings/review/1'] },
    viewport: { defaultViewport: 'pyxisAppDesktop' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const artist = await canvas.findByLabelText(/artist \/ act/i);
    await userEvent.clear(artist);
    await userEvent.type(artist, 'Story Booking Edit');
    await userEvent.click(await canvas.findByRole('button', { name: /save booking details/i }));
    await expect(artist).toHaveValue('Story Booking Edit');
  },
};

export const SaveReviewNoteMutation: Story = {
  render: () => renderWithFreshMockState(<RoutedPage path="/bookings/review/:id" element={<BookingReviewPage />} />),
  parameters: {
    router: { initialEntries: ['/bookings/review/1'] },
    viewport: { defaultViewport: 'pyxisAppDesktop' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const note = await canvas.findByLabelText(/internal review note/i);
    await userEvent.clear(note);
    await userEvent.type(note, 'Storybook saved review note.');
    await userEvent.click(await canvas.findByRole('button', { name: /save review note/i }));
    await expect(note).toHaveValue('Storybook saved review note.');
  },
};
