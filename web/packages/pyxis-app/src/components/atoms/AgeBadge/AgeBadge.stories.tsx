import type { Meta, StoryObj } from '@storybook/react';
import { AgeBadge } from './AgeBadge';

const meta = {
  title: 'Pyxis App/Components/Atoms/AgeBadge',
  component: AgeBadge,
  args: {
    children: '21+',
  },
} satisfies Meta<typeof AgeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllAges: Story = {
  args: {
    children: 'All Ages',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 24 }}>
      <AgeBadge>21+</AgeBadge>
      <AgeBadge>18+</AgeBadge>
      <AgeBadge>All Ages</AgeBadge>
    </div>
  ),
};
