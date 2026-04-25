import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveShowList } from './ArchiveShowList';

const meta: Meta<typeof ArchiveShowList> = {
  title: 'Public/Organisms/ArchiveShowList',
  component: ArchiveShowList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArchiveShowList>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ArchiveShowList {...args} />
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    shows: [
      { date: 'Dec 12', name: 'Winter Solstice Rave', tag: 'Electronic' },
      { date: 'Nov 29', name: 'A Very Long Archived Experimental Noise Evening', tag: 'Noise / Experimental' },
      { date: 'Nov 15', name: 'Bottom Feeders', tag: 'Hardcore' },
    ],
  },
  render: (args) => (
    <div style={{ width: 520 }}>
      <ArchiveShowList {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-archive-show-row-border-color': 'var(--color-accent)',
        '--pyxis-archive-show-row-muted-color': 'var(--color-text-secondary)',
        '--pyxis-archive-show-row-title-color': 'var(--color-text-primary)',
        width: 620,
      } as CSSProperties}
    >
      <ArchiveShowList {...args} />
    </div>
  ),
};
