import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookingSpaceAside } from './BookingSpaceAside';

const meta: Meta<typeof BookingSpaceAside> = {
  title: 'Public/Organisms/BookingSpaceAside',
  component: BookingSpaceAside,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookingSpaceAside>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <BookingSpaceAside {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 300 }}>
      <BookingSpaceAside {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-booking-space-bg': 'var(--color-surface-raised)',
        '--pyxis-booking-space-color': 'var(--color-text-primary)',
        '--pyxis-booking-space-muted-color': 'var(--color-accent)',
        '--pyxis-booking-space-body-color': 'var(--color-text-secondary)',
        '--pyxis-booking-space-divider-color': 'var(--color-accent)',
        width: 420,
      } as CSSProperties}
    >
      <BookingSpaceAside {...args} />
    </div>
  ),
};
