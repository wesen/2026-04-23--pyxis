import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveShowRow } from './ArchiveShowRow';

const meta: Meta<typeof ArchiveShowRow> = {
  title: 'Public/Molecules/ArchiveShowRow',
  component: ArchiveShowRow,
  tags: ['autodocs'],
  args: {
    date: 'Dec 12',
    name: 'Winter Solstice Rave',
    tag: 'Electronic',
  },
};

export default meta;
type Story = StoryObj<typeof ArchiveShowRow>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 620 }}>
      <ArchiveShowRow {...args} />
    </div>
  ),
};

export const LongName: Story = {
  args: {
    date: 'Nov 29',
    name: 'A Very Long Archived Experimental Noise Evening',
    tag: 'Noise / Experimental',
  },
  render: (args) => (
    <div style={{ width: 520 }}>
      <ArchiveShowRow {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-archive-show-row-border-color': 'var(--color-accent)',
        '--pyxis-archive-show-row-muted-color': 'var(--color-text-secondary)',
        '--pyxis-archive-show-row-title-color': 'var(--color-text-primary)',
        width: 620,
      } as CSSProperties}
    >
      <ArchiveShowRow {...args} />
    </div>
  ),
};
