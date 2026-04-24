import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';
import { StoryFrame } from '../../storybook';

const meta: Meta<typeof Stat> = {
  title: 'Molecules/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: {
    label: 'Shows this month',
    value: 12,
    sub: '4 confirmed · 8 holds',
    trend: '+3 from last month',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DashboardSet: Story = {
  render: () => (
    <StoryFrame id="molecules-stat-dashboard-set" component="stat" level="molecule" layout="grid" gap={14}>
      <Stat label="Shows" value={12} sub="This month" trend="+3" />
      <Stat label="Bookings" value={47} sub="Requests" trend="+12%" accentColor="var(--color-info)" />
      <Stat label="Capacity" value="82%" sub="Average sold" trend="Healthy" accentColor="var(--color-success)" />
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};
