import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingsProcessedPanel } from './BookingsProcessedPanel';
const meta: Meta = { title: 'Pyxis App/Organisms/Bookings', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ProcessedPanel: Story = { render: () => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsProcessedPanel bookings={bookings}/></div> };
