import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { YearGroup } from './YearGroup';

const meta: Meta<typeof YearGroup> = {
  title: 'Public/Molecules/YearGroup',
  component: YearGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YearGroup>;

export const Default: Story = {
  args: { year: 2024, showCount: 12 },
};

export const Singular: Story = {
  args: { year: 2026, showCount: 1 },
};

export const ThemeOverride: Story = {
  args: { year: 2024, showCount: 12 },
  render: (args) => (
    <div
      style={{
        '--pyxis-year-group-accent-color': 'var(--color-text-primary)',
        '--pyxis-year-group-border-color': 'var(--color-accent)',
        '--pyxis-year-group-muted-color': 'var(--color-accent)',
        width: 420,
      } as CSSProperties}
    >
      <YearGroup {...args} />
    </div>
  ),
};
