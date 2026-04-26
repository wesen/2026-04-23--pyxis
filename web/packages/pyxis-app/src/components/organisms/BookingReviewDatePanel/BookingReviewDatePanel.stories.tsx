import type { Meta, StoryObj } from '@storybook/react';
import { BookingReviewDatePanel } from './BookingReviewDatePanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/BookingReviewDatePanel',
  component: BookingReviewDatePanel,
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof BookingReviewDatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewDatePanel: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewDatePanel {...args}/></div>,
};

export const Conflict: Story = {
  args: {
    statusLabel: '△ Possible date conflict',
    detail: 'Jul 18 has a hold. Check whether that hold is still active before approving.',
  },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><BookingReviewDatePanel {...args}/></div>,
};
