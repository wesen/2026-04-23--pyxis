import type { Meta, StoryObj } from '@storybook/react';
import { SubmissionStatus } from 'pyxis-types';
import { bookings } from '../../../../api/mockData';
import { BookingReviewHero } from './BookingReviewHero';

const booking = bookings.find((item) => item.status === SubmissionStatus.PENDING) ?? bookings[0];

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingReviewHero',
  component: BookingReviewHero,
  parameters: { layout: 'fullscreen' },
  args: { booking },
} satisfies Meta<typeof BookingReviewHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewHeroMobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingReviewHero {...args}/></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Approved: Story = {
  args: { booking: bookings.find((item) => item.status === SubmissionStatus.APPROVED) ?? booking },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingReviewHero {...args}/></div>,
};

export const LongArtistName: Story = {
  args: { booking: { ...booking, artistName: 'A Very Long Booking Request Artist Name' } },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingReviewHero {...args}/></div>,
};
