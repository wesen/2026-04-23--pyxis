import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowLineupRowEditor } from './ShowLineupRowEditor';

const meta = {
  title: 'Pyxis App/Components/Molecules/ShowLineupRowEditor',
  component: ShowLineupRowEditor,
  parameters: { layout: 'fullscreen' },
  args: {
    index: 0,
    slot: { artist: 'YOYOYOYO', role: 'Headline', startTime: '9:00 PM', endTime: '10:00 PM' },
    onChange: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof ShowLineupRowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 780, padding: 24, background: 'var(--app-surface)' }}><ShowLineupRowEditor {...args} /></div>,
};

export const Empty: Story = {
  args: { slot: { artist: '', role: 'support', startTime: '', endTime: '' } },
  render: (args) => <div style={{ width: 780, padding: 24, background: 'var(--app-surface)' }}><ShowLineupRowEditor {...args} /></div>,
};

export const RequiredOnlyRow: Story = {
  args: { canRemove: false },
  render: (args) => <div style={{ width: 780, padding: 24, background: 'var(--app-surface)' }}><ShowLineupRowEditor {...args} /></div>,
};

export const Narrow: Story = {
  render: (args) => <div style={{ width: 360, padding: 16, background: 'var(--app-surface)' }}><ShowLineupRowEditor {...args} /></div>,
};
