import type { Meta, StoryObj } from '@storybook/react';
import { DashboardAttentionPanel } from '.';
import { defaultDashboardAttentionItems } from '../DashboardAttentionContent';

const denseItems = [
  ...defaultDashboardAttentionItems,
  { tone: 'warning' as const, title: 'Hold expiring tonight', caption: 'SUNN O))) needs a confirmation before midnight' },
  { tone: 'info' as const, title: 'New rider uploaded', caption: 'Check hospitality notes for William Basinski' },
];

const meta: Meta<typeof DashboardAttentionPanel> = {
  title: 'Pyxis App/Components/Organisms/DashboardAttentionPanel',
  component: DashboardAttentionPanel,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof DashboardAttentionPanel>;

export const Desktop: Story = {
  render: (args) => (
    <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardAttentionPanel {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { variant: 'mobile' },
  render: (args) => (
    <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}>
      <DashboardAttentionPanel {...args} />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Dense: Story = {
  args: { items: denseItems },
  render: (args) => (
    <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardAttentionPanel {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { items: [] },
  render: (args) => (
    <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}>
      <DashboardAttentionPanel {...args} />
    </div>
  ),
};
