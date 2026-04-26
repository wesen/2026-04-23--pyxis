import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingReviewNotePanel } from './BookingReviewNotePanel';

const booking = bookings.find((item) => item.status === 'pending') ?? bookings[0];

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingReviewNotePanel',
  component: BookingReviewNotePanel,
  parameters: { layout: 'fullscreen' },
  args: { booking },
} satisfies Meta<typeof BookingReviewNotePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewNotePanel: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewNotePanel {...args}/></div>,
};

export const ProvidedNote: Story = {
  args: { booking: { ...booking, notes: 'We can bring a full backline and are flexible on support acts.' } },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewNotePanel {...args}/></div>,
};

export const LongNote: Story = {
  args: { booking: { ...booking, notes: 'This is a much longer note from an artist that describes routing, preferred bill partners, accessibility needs, backline constraints, and timing details for a potential show.' } },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewNotePanel {...args}/></div>,
};
