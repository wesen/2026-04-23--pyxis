import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowEditHeader } from './ShowEditHeader';

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowEdit/ShowEditHeader',
  component: ShowEditHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Edit show',
    subtitle: 'Update your show details, lineup, and assets.',
    canPreview: true,
    onBack: fn(),
    onPreview: fn(),
    onDuplicate: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof ShowEditHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <div style={{ padding: 32, background: 'var(--app-canvas)' }}><ShowEditHeader {...args} /></div> };
export const Saving: Story = { args: { isSaving: true }, render: (args) => <div style={{ padding: 32, background: 'var(--app-canvas)' }}><ShowEditHeader {...args} /></div> };
export const Narrow: Story = { render: (args) => <div style={{ width: 360, padding: 18, background: 'var(--app-canvas)' }}><ShowEditHeader {...args} /></div> };
