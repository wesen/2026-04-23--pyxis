import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingReviewNotePanel } from './BookingReviewNotePanel';
const booking = bookings.find((item) => item.status === 'pending') ?? bookings[0];
const meta: Meta = { title: 'Pyxis App/Components/Organisms/BookingReviewNotePanel', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ReviewNotePanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewNotePanel booking={booking}/></div> };
