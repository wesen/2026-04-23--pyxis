import type { Meta, StoryObj } from '@storybook/react';
import { DiscordChannelRow } from './DiscordChannelRow';
const meta: Meta = { title: 'Pyxis App/Components/Molecules/DiscordChannelRow' };
export default meta;
type Story = StoryObj;
export const DiscordRowDefault: Story = { render: () => <div style={{ width: 520, padding: 24 }}><DiscordChannelRow mapping={{ kind: 'bookingRequests', label: 'Booking requests', channelName: '#booking-requests', channelId: '847392017483620358', enabled: true }}/></div> };
