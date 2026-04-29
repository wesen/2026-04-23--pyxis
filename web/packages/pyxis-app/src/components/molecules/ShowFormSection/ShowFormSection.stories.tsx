import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'pyxis-components';
import { ShowFormSection } from './ShowFormSection';

const meta = {
  title: 'Pyxis App/Components/Molecules/ShowFormSection',
  component: ShowFormSection,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Basics',
    description: 'Core public information for this show.',
    children: <div style={{ border: '1px dashed var(--app-rule)', borderRadius: 10, padding: 16 }}>Section content</div>,
  },
} satisfies Meta<typeof ShowFormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 720, padding: 24, background: 'var(--app-surface)' }}><ShowFormSection {...args} /></div>,
};

export const WithAction: Story = {
  args: { action: <Button type="button" variant="outline" size="sm" iconLeft="plus">Add row</Button> },
  render: (args) => <div style={{ width: 720, padding: 24, background: 'var(--app-surface)' }}><ShowFormSection {...args} /></div>,
};

export const Narrow: Story = {
  args: { action: <Button type="button" variant="outline" size="sm" iconLeft="plus">Add row</Button> },
  render: (args) => <div style={{ width: 340, padding: 16, background: 'var(--app-surface)' }}><ShowFormSection {...args} /></div>,
};
