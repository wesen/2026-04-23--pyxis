import type { Meta, StoryObj } from '@storybook/react';
import { BookingsInsightsPanel } from './BookingsInsightsPanel';
const meta: Meta = { title: 'Pyxis App/Organisms/Bookings', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const InsightsPanel: Story = { render: () => <div style={{ width: 330, padding: 24, background: 'var(--app-canvas)' }}><BookingsInsightsPanel/></div> };
