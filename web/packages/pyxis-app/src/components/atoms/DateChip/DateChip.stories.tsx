import type { Meta, StoryObj } from '@storybook/react';
import { DateChip } from './DateChip';

const meta = {
  title: 'Pyxis App/Components/Atoms/DateChip',
  component: DateChip,
  args: {
    date: '2025-05-02',
  },
} satisfies Meta<typeof DateChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomKicker: Story = {
  args: {
    kicker: 'Tonight',
  },
};

export const Inline: Story = {
  args: {
    kicker: 'Friday',
    variant: 'inline',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 24 }}>
      <DateChip date="2025-05-02" />
      <DateChip date="2025-05-02" kicker="Tonight" />
      <DateChip date="2025-05-02" kicker="Friday" variant="inline" />
    </div>
  ),
};
