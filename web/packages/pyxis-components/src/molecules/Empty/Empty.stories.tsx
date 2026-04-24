import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Empty } from './Empty';

const meta: Meta<typeof Empty> = {
  title: 'Molecules/Empty',
  component: Empty,
  tags: ['autodocs'],
  args: {
    title: 'No bookings yet',
    description: 'When artists submit booking requests, they will appear here.',
    action: <Button size="sm">Create hold</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoAction: Story = {
  args: { action: undefined },
};
