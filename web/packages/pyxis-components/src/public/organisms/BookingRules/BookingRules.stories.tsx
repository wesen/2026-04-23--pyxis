import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookingRules } from './BookingRules';

const meta: Meta<typeof BookingRules> = {
  title: 'Public Site/Components/Organisms/BookingRules',
  component: BookingRules,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookingRules>;

export const Default: Story = {
  args: {},
};

export const Narrow: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 300 }}>
      <BookingRules {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-booking-rules-bg': 'var(--color-surface-raised)',
        '--pyxis-booking-rules-color': 'var(--color-text-primary)',
        '--pyxis-booking-rules-body-color': 'var(--color-text-secondary)',
        width: 420,
      } as CSSProperties}
    >
      <BookingRules {...args} />
    </div>
  ),
};
