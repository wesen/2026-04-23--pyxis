import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot, type StatusTone } from './StatusDot';

const tones: StatusTone[] = ['confirmed', 'pending', 'approved', 'declined', 'archived', 'hold', 'blocked', 'draft', 'bot', 'neutral'];

const meta = {
  title: 'Pyxis App/Components/Atoms/StatusDot',
  component: StatusDot,
  args: {
    tone: 'confirmed',
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    tone: 'pending',
  },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, padding: 24 }}>
      {tones.map((tone) => <StatusDot key={tone} tone={tone} />)}
    </div>
  ),
};

export const WithAccessibleLabel: Story = {
  args: {
    tone: 'bot',
    label: 'Bot activity',
  },
};
