import type { Meta, StoryObj } from '@storybook/react';
import { BookingSuccess } from './BookingSuccess';
const meta: Meta<typeof BookingSuccess> = { title: 'Public/Organisms/BookingSuccess', component: BookingSuccess, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof BookingSuccess>;
export const Default: Story = { args: {} };
