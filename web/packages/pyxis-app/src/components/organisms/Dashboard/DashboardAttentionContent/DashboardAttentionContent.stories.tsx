import type { Meta, StoryObj } from '@storybook/react';
import { DashboardAttentionContent, defaultDashboardAttentionItems } from '.';

const meta = {
  title: 'Pyxis App/Components/Organisms/Dashboard/DashboardAttentionContent',
  component: DashboardAttentionContent,
  args: {
    items: defaultDashboardAttentionItems,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardAttentionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><DashboardAttentionContent {...args} /></div>,
};

export const Empty: Story = {
  args: { items: [] },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><DashboardAttentionContent {...args} /></div>,
};

export const Dense: Story = {
  args: {
    items: [
      ...defaultDashboardAttentionItems,
      { tone: 'warning', title: 'Hold expiring tonight', caption: 'SUNN O))) needs a confirmation before midnight' },
      { tone: 'info', title: 'New rider uploaded', caption: 'Check hospitality notes for William Basinski' },
    ],
  },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><DashboardAttentionContent {...args} /></div>,
};
