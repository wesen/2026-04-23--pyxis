import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { CardHead } from './CardHead';

const meta: Meta<typeof CardHead> = {
  title: 'Molecules/CardHead',
  component: CardHead,
  tags: ['autodocs'],
  args: {
    title: 'Upcoming shows',
    subtitle: 'Confirmed and tentative holds for this month.',
    action: <Button size="sm" variant="outline">View all</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: { subtitle: undefined, action: undefined },
};
