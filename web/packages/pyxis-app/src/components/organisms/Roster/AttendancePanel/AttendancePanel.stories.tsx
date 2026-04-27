import type { Meta, StoryObj } from '@storybook/react';
import { attendance } from '../../../api/mockData';
import { AttendancePanel } from './AttendancePanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/AttendancePanel',
  component: AttendancePanel,
  parameters: { layout: 'fullscreen' },
  args: { entries: attendance },
} satisfies Meta<typeof AttendancePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><AttendancePanel {...args} /></div>,
};

export const Empty: Story = {
  args: { entries: [] },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><AttendancePanel {...args} /></div>,
};

export const AllLogged: Story = {
  args: { entries: attendance.map((entry) => ({ ...entry, logged: true, draw: entry.draw ?? 42 })) },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><AttendancePanel {...args} /></div>,
};
