import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveStats } from './ArchiveStats';
import { seedStats } from '../../../mocks/handlers';

const meta: Meta<typeof ArchiveStats> = {
  title: 'Public Site/Components/Molecules/ArchiveStats',
  component: ArchiveStats,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArchiveStats>;

export const Default: Story = {
  args: { stats: seedStats },
};

export const ThemeOverride: Story = {
  args: { stats: seedStats },
  render: (args) => (
    <div
      style={{
        '--pyxis-archive-stats-border-color': 'var(--color-accent)',
        '--pyxis-archive-stats-value-color': 'var(--color-text-primary)',
        '--pyxis-archive-stats-label-color': 'var(--color-accent)',
        width: 620,
      } as CSSProperties}
    >
      <ArchiveStats {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: { stats: seedStats },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ArchiveStats {...args} />
    </div>
  ),
};
