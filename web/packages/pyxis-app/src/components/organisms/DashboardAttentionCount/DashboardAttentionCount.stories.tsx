import type { Meta, StoryObj } from '@storybook/react';
import { DashboardAttentionCount } from '.';

const meta = {
  title: 'Pyxis App/Components/Organisms/DashboardAttentionCount',
  component: DashboardAttentionCount,
  args: {
    count: 3,
  },
} satisfies Meta<typeof DashboardAttentionCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ padding: 24 }}><DashboardAttentionCount {...args} /></div>,
};

export const Zero: Story = {
  args: { count: 0 },
  render: (args) => <div style={{ padding: 24 }}><DashboardAttentionCount {...args} /></div>,
};
