import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../src/api/mockData';
import { BookingReviewDatePanel, BookingReviewHero, BookingReviewNotePanel, BookingReviewRequestPanel, BookingsInboxPanel, BookingsInsightsPanel, BookingsProcessedPanel } from '../src/components/organisms/Phase8Sections';

const booking = bookings.find((item) => item.status === 'pending') ?? bookings[0];
const meta: Meta = { title: 'Pyxis App/Organisms/Bookings', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

export const InboxPanel: Story = { render: () => <div style={{ width: 720, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel bookings={bookings}/></div> };
export const ProcessedPanel: Story = { render: () => <div style={{ width: 720, padding: 24, background: 'var(--app-canvas)' }}><BookingsProcessedPanel bookings={bookings}/></div> };
export const InsightsPanel: Story = { render: () => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><BookingsInsightsPanel/></div> };
export const ReviewHeroMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><BookingReviewHero booking={booking}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
export const ReviewRequestPanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewRequestPanel booking={booking}/></div> };
export const ReviewDatePanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewDatePanel/></div> };
export const ReviewNotePanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewNotePanel booking={booking}/></div> };
export const InboxEmpty: Story = { render: () => <div style={{ width: 720, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel bookings={[]}/></div> };
