import type { Meta, StoryObj } from '@storybook/react';
import { DashboardMobileHeader } from './DashboardMobileHeader';

const meta = {
  title: 'Pyxis App/Components/Organisms/DashboardMobileHeader',
  component: DashboardMobileHeader,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'pyxisAppMobile' } },
  args: {},
} satisfies Meta<typeof DashboardMobileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileHeader {...args} /></div>,
};

export const AlternateUser: Story = {
  args: {
    dateLabel: 'Fri, May 2',
    initials: 'JV',
  },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardMobileHeader {...args} /></div>,
};
