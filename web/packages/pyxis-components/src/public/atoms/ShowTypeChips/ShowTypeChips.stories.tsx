import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowTypeChips } from './ShowTypeChips';

const meta: Meta<typeof ShowTypeChips> = {
  title: 'Public Site/Components/Atoms/ShowTypeChips',
  component: ShowTypeChips,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShowTypeChips>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ShowTypeChips {...args} />
    </div>
  ),
};

export const Wrapped: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 280 }}>
      <ShowTypeChips {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: { active: 'DJ night' },
  render: (args) => (
    <div
      style={{
        '--pyxis-show-type-chips-active-bg': 'var(--color-accent)',
        '--pyxis-show-type-chips-active-color': 'var(--color-text-inverse)',
        '--pyxis-show-type-chips-border-color': 'var(--color-accent)',
        '--pyxis-show-type-chips-color': 'var(--color-text-primary)',
        width: 620,
      } as CSSProperties}
    >
      <ShowTypeChips {...args} />
    </div>
  ),
};
