import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetailHeader } from './ShowDetailHeader';

const meta: Meta<typeof ShowDetailHeader> = {
  title: 'Public Site/Components/Molecules/ShowDetailHeader',
  component: ShowDetailHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShowDetailHeader>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ShowDetailHeader {...args} />
    </div>
  ),
};

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Show Title for Wrapping',
    description: 'A longer description used to exercise line wrapping in the show detail header without changing the component contract.',
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <ShowDetailHeader {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-show-detail-header-accent-color': 'var(--color-text-primary)',
        '--pyxis-show-detail-header-muted-color': 'var(--color-text-secondary)',
        width: 620,
      } as CSSProperties}
    >
      <ShowDetailHeader {...args} />
    </div>
  ),
};
