import type { Meta, StoryObj } from '@storybook/react';
import { BookingReviewDatePanel } from './BookingReviewDatePanel';
const meta: Meta = { title: 'Pyxis App/Organisms/Bookings', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ReviewDatePanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewDatePanel/></div> };
