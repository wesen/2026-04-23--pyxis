import type { Meta, StoryObj } from '@storybook/react';
import { BookingForm } from './BookingForm';
const meta: Meta<typeof BookingForm> = { title: 'Public/Organisms/BookingForm', component: BookingForm, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof BookingForm>;
export const Default: Story = { args: {} };
