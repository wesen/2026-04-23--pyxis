import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { create, Show_LineupEntrySchema } from 'pyxis-types';
import { LineupRow } from './LineupRow';

const meta: Meta<typeof LineupRow> = {
  title: 'Public/Molecules/LineupRow',
  component: LineupRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LineupRow>;

export const Default: Story = {
  args: { entry: create(Show_LineupEntrySchema, { artist: 'Burial Hex', role: 'headline', startTime: '9:00 PM' }) },
};

export const Support: Story = {
  args: { entry: create(Show_LineupEntrySchema, { artist: 'DJ TBA', role: 'support', startTime: '8:15 PM' }) },
};

export const ThemeOverride: Story = {
  args: { entry: create(Show_LineupEntrySchema, { artist: 'Burial Hex', role: 'headline', startTime: '9:00 PM' }) },
  render: (args) => (
    <div
      style={{
        '--pyxis-lineup-row-border-color': 'var(--color-accent)',
        '--pyxis-lineup-row-muted-color': 'var(--color-text-secondary)',
        '--pyxis-lineup-row-artist-color': 'var(--color-text-primary)',
        width: 420,
      } as CSSProperties}
    >
      <LineupRow {...args} />
    </div>
  ),
};
