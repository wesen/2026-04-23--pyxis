import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingCard } from './BookingCard';
const meta: Meta = { title: 'Pyxis App/Components' };
export default meta;
type Story = StoryObj;
export const BookingCardDefault: Story = { render: () => <div style={{ width: 360, padding: 24 }}><BookingCard booking={bookings[0]}/></div> };
