import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveSearchFilters } from './ArchiveSearchFilters';

const meta: Meta<typeof ArchiveSearchFilters> = {
  title: 'Public/Molecules/ArchiveSearchFilters',
  component: ArchiveSearchFilters,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArchiveSearchFilters>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ArchiveSearchFilters {...args} />
    </div>
  ),
};

export const Wrapped: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 300 }}>
      <ArchiveSearchFilters {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: { active: '2024' },
  render: (args) => (
    <div
      style={{
        '--pyxis-archive-search-active-bg': 'var(--color-accent)',
        '--pyxis-archive-search-border-color': 'var(--color-accent)',
        '--pyxis-archive-search-color': 'var(--color-text-primary)',
        width: 620,
      } as CSSProperties}
    >
      <ArchiveSearchFilters {...args} />
    </div>
  ),
};
