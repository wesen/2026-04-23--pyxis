import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'pyxis-components';
import { AppEmptyState } from './AppEmptyState';

const meta = {
  title: 'Pyxis App/Components/Molecules/AppEmptyState',
  component: AppEmptyState,
  args: {
    title: 'No pending booking requests.',
  },
} satisfies Meta<typeof AppEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: 'No confirmed shows yet.',
    description: 'Create a show or approve a booking request to fill this section.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No audit log entries yet.',
    description: 'Activity will appear here as staff and the bot update the space.',
    action: <Button size="sm" variant="outline">Refresh</Button>,
  },
};
