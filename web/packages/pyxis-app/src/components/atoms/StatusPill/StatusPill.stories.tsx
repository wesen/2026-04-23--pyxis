import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill';
import type { StatusTone } from '../StatusDot';

const labels: Array<[StatusTone, string]> = [
  ['confirmed', 'Confirmed'],
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['declined', 'Declined'],
  ['archived', 'Archived'],
  ['hold', 'Hold'],
  ['blocked', 'Blocked'],
  ['draft', 'Draft'],
  ['bot', 'Bot'],
  ['neutral', 'Neutral'],
];

const meta = {
  title: 'Pyxis App/Components/Atoms/StatusPill',
  component: StatusPill,
  args: {
    tone: 'confirmed',
    children: 'Confirmed',
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    tone: 'pending',
    children: 'Pending',
  },
};

export const LongLabel: Story = {
  args: {
    tone: 'hold',
    children: 'Hold requested',
  },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 24 }}>
      {labels.map(([tone, label]) => <StatusPill key={tone} tone={tone}>{label}</StatusPill>)}
    </div>
  ),
};
