import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingsInboxPanel } from './BookingsInboxPanel';
const meta: Meta = { title: 'Pyxis App/Components/Organisms/BookingsInboxPanel', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const InboxPanel: Story = { render: () => <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel bookings={bookings}/></div> };
export const InboxEmpty: Story = { render: () => <div style={{ width: 720, padding: 24, background: 'var(--app-canvas)' }}><BookingsInboxPanel bookings={[]}/></div> };
