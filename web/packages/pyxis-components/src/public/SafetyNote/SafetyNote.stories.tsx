import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SafetyNote } from './SafetyNote';

const meta: Meta<typeof SafetyNote> = {
  title: 'Public/Molecules/SafetyNote',
  component: SafetyNote,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SafetyNote>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <SafetyNote {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {
    children: 'quiet house note with a custom local theme override, keeping the same semantic part contract.',
  },
  render: (args) => (
    <div
      style={{
        '--pyxis-safety-note-color': 'var(--color-accent)',
        '--pyxis-safety-note-border-color': 'var(--color-accent)',
        width: 620,
      } as CSSProperties}
    >
      <SafetyNote {...args} />
    </div>
  ),
};
