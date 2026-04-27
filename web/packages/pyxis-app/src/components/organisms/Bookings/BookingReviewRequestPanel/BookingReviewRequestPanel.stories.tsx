import type { Meta, StoryObj } from '@storybook/react';
import { SubmissionStatus } from 'pyxis-types';
import { bookings } from '../../../../api/mockData';
import { BookingReviewRequestPanel } from './BookingReviewRequestPanel';

const booking = bookings.find((item) => item.status === SubmissionStatus.PENDING) ?? bookings[0];

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingReviewRequestPanel',
  component: BookingReviewRequestPanel,
  parameters: { layout: 'fullscreen' },
  args: { booking },
} satisfies Meta<typeof BookingReviewRequestPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewRequestPanel: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewRequestPanel {...args}/></div>,
};

export const LongLink: Story = {
  args: { booking: { ...booking, links: 'https://example.com/a-very-long-artist-profile-and-booking-reference-link' } },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewRequestPanel {...args}/></div>,
};

export const AlternateDate: Story = {
  args: { preferredDateLabel: 'Fri, Jul 18' },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewRequestPanel {...args}/></div>,
};
