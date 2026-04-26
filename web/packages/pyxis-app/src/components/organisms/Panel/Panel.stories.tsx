import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'pyxis-components';
import { Panel } from './Panel';

const meta = {
  title: 'Pyxis App/Components/Organisms/Panel',
  component: Panel,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Panel title',
    kicker: 'Short supporting copy for this section.',
    children: <p style={{ margin: 0 }}>Panel body content.</p>,
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><Panel {...args} /></div>,
};

export const WithAction: Story = {
  args: {
    action: <Button variant="outline" size="sm">View all</Button>,
  },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><Panel {...args} /></div>,
};

export const LongHeader: Story = {
  args: {
    title: 'A longer panel title that should wrap gracefully',
    kicker: 'A longer kicker that explains the section and makes sure spacing still works when copy grows beyond the prototype default.',
    action: <Button variant="ghost" size="sm">Open</Button>,
  },
  render: (args) => <div style={{ width: 420, padding: 24, background: 'var(--app-canvas)' }}><Panel {...args} /></div>,
};

export const DenseBody: Story = {
  args: {
    title: 'Dense body',
    children: (
      <div className="app-card-list">
        <p style={{ margin: 0 }}>First row</p>
        <p style={{ margin: 0 }}>Second row</p>
        <p style={{ margin: 0 }}>Third row</p>
      </div>
    ),
  },
  render: (args) => <div style={{ width: 520, padding: 24, background: 'var(--app-canvas)' }}><Panel {...args} /></div>,
};
