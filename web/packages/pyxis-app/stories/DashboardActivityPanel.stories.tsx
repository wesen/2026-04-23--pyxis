import type { Meta, StoryObj } from '@storybook/react';
import { auditLog } from '../src/api/mockData';
import { DashboardActivityPanel } from '../src/components/organisms/Panels';

const meta: Meta<typeof DashboardActivityPanel> = {
  title: 'Pyxis App/Organisms/DashboardActivityPanel',
  component: DashboardActivityPanel,
  parameters: { layout: 'fullscreen' },
  args: { log: auditLog },
};

export default meta;
type Story = StoryObj<typeof DashboardActivityPanel>;

export const Default: Story = {
  render: (args) => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><DashboardActivityPanel {...args} /></div>,
};

export const Mobile: Story = {
  args: { limit: 3 },
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><DashboardActivityPanel {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Empty: Story = {
  args: { log: [] },
  render: (args) => <div style={{ width: 390, padding: 24, background: 'var(--app-canvas)' }}><DashboardActivityPanel {...args} /></div>,
};
