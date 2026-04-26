import type { Meta, StoryObj } from '@storybook/react';
import { DrawProgress } from './DrawProgress';

const meta = {
  title: 'Pyxis App/Components/Atoms/DrawProgress',
  component: DrawProgress,
  args: {
    value: 70,
    max: 150,
  },
} satisfies Meta<typeof DrawProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LowDraw: Story = {
  args: {
    value: 28,
    max: 150,
  },
};

export const NearCapacity: Story = {
  args: {
    value: 132,
    max: 150,
  },
};

export const OverCapacity: Story = {
  args: {
    value: 168,
    max: 150,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 18, width: 220, padding: 24 }}>
      <DrawProgress value={28} max={150} />
      <DrawProgress value={70} max={150} />
      <DrawProgress value={132} max={150} />
      <DrawProgress value={168} max={150} />
    </div>
  ),
};
