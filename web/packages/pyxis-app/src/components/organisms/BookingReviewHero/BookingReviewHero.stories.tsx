import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingReviewHero } from './BookingReviewHero';
const booking = bookings.find((item) => item.status === 'pending') ?? bookings[0];
const meta: Meta = { title: 'Pyxis App/Components/Organisms/BookingReviewHero', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ReviewHeroMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingReviewHero booking={booking}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
