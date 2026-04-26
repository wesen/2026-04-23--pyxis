import type { Meta, StoryObj } from '@storybook/react';
import { DashboardMobileCopy } from './DashboardMobileCopy';

const meta = {
  title: 'Pyxis App/Components/Organisms/DashboardMobileCopy',
  component: DashboardMobileCopy,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'pyxisAppMobile' } },
  args: {},
} satisfies Meta<typeof DashboardMobileCopy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileCopy {...args} /></div>,
};

export const EmptyDay: Story = {
  args: {
    title: 'Good morning, Ada.',
    summary: 'No confirmed shows · inbox is clear.',
  },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileCopy {...args} /></div>,
};

export const LongCopy: Story = {
  args: {
    eyebrow: 'Welcome back',
    title: 'Good afternoon, Ada.',
    summary: '12 shows booked · 9 booking requests need your eye before the next staff meeting.',
  },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileCopy {...args} /></div>,
};
