import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { TopBar } from './TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Organisms/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  args: {
    breadcrumb: 'Admin / Shows',
    title: 'Upcoming shows',
    subtitle: 'Manage holds, confirmations, and settlements.',
    actions: <><Button size="sm" variant="outline">Export</Button><Button size="sm">New show</Button></>,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoActions: Story = {
  args: { actions: undefined },
};
