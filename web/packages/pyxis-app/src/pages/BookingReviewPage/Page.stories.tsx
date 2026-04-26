import type { Meta, StoryObj } from '@storybook/react';
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
