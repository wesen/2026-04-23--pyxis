import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookingForm } from './BookingForm';

const meta: Meta<typeof BookingForm> = {
  title: 'Public Site/Components/Organisms/BookingForm',
  component: BookingForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookingForm>;

export const Default: Story = {
  args: {},
};

export const Submitting: Story = {
  args: { isSubmitting: true },
};

export const PrototypeInquiry: Story = {
  args: {
    visibleFields: { links: false, genre: false, showType: true, techRider: false, agreement: true },
  },
  render: (args) => (
    <div style={{ width: 548 }}>
      <BookingForm {...args} />
    </div>
  ),
};

export const MinimalRtkPayload: Story = {
  args: {
    intro: 'When a route already knows the show date, keep the form short and pass the known values separately on submit.',
    visibleFields: { name: false, links: false, preferredDate: false, expectedDraw: false, genre: false, techRider: false, agreement: true },
    showTypeOptions: ['DJ night', 'Live music'],
    defaultShowType: 'DJ night',
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <BookingForm {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 360 }}>
      <BookingForm {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-booking-form-accent-color': 'var(--color-text-primary)',
        '--pyxis-booking-form-border-color': 'var(--color-accent)',
        '--pyxis-booking-form-muted-color': 'var(--color-text-secondary)',
        width: 620,
      } as CSSProperties}
    >
      <BookingForm {...args} />
    </div>
  ),
};
