import type { Meta, StoryObj } from '@storybook/react';
import { auditLog } from '../../../api/mockData';
import { AuditLogPanel } from './AuditLogPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/AuditLogPanel',
  component: AuditLogPanel,
  parameters: { layout: 'fullscreen' },
  args: { log: auditLog },
} satisfies Meta<typeof AuditLogPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><AuditLogPanel {...args} /></div>,
};

export const Empty: Story = {
  args: { log: [] },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><AuditLogPanel {...args} /></div>,
};

export const Dense: Story = {
  args: { log: [...auditLog, ...auditLog.map((item) => ({ ...item, id: item.id + 100 }))] },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><AuditLogPanel {...args} /></div>,
};
