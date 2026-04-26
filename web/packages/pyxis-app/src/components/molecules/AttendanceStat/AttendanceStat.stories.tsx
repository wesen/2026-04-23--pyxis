import type { Meta, StoryObj } from '@storybook/react';
import { AttendanceStat } from './AttendanceStat';

const meta = {
  title: 'Pyxis App/Components/Molecules/AttendanceStat',
  component: AttendanceStat,
  args: {
    label: 'Logged',
    value: 3,
  },
} satisfies Meta<typeof AttendanceStat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NeedsLog: Story = {
  args: { label: 'Needs log', value: 1 },
};

export const LargeValue: Story = {
  args: { label: 'Average draw', value: 128 },
};

export const StatRow: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: 520, padding: 24 }}>
      <AttendanceStat label="Logged" value={3}/>
      <AttendanceStat label="Needs log" value={1}/>
      <AttendanceStat label="Average draw" value={84}/>
    </div>
  ),
};
