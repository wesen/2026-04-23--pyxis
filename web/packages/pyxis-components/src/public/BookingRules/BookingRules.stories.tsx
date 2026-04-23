import type { Meta, StoryObj } from '@storybook/react';
import { BookingRules } from './BookingRules';
const meta: Meta<typeof BookingRules> = { title: 'Public/BookingRules', component: BookingRules, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof BookingRules>;
export const Default: Story = { args: {} };
