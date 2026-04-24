import type { Meta, StoryObj } from '@storybook/react';
import { BookingSpaceAside } from './BookingSpaceAside';
const meta: Meta<typeof BookingSpaceAside> = { title: 'Public/Organisms/BookingSpaceAside', component: BookingSpaceAside, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof BookingSpaceAside>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><BookingSpaceAside {...args} /></div> };
