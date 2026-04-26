import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PublicPageHeader } from './PublicPageHeader';

const meta: Meta<typeof PublicPageHeader> = {
  title: 'Public Site/Components/Molecules/PublicPageHeader',
  component: PublicPageHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PublicPageHeader>;

export const Default: Story = {
  args: { kicker: 'Providence, RI', title: 'Upcoming shows' },
  render: (args) => (
    <div style={{ width: 920 }}>
      <PublicPageHeader {...args} />
    </div>
  ),
};

export const LongTitle: Story = {
  args: { kicker: 'Providence, RI', title: 'Upcoming shows and community gatherings' },
  render: (args) => (
    <div style={{ width: 520 }}>
      <PublicPageHeader {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: { kicker: 'Providence, RI', title: 'Upcoming shows' },
  render: (args) => (
    <div
      style={{
        '--pyxis-public-page-header-accent-color': 'var(--color-text-primary)',
        '--pyxis-public-page-header-border-color': 'var(--color-accent)',
        '--pyxis-public-page-header-muted-color': 'var(--color-accent)',
        width: 920,
      } as CSSProperties}
    >
      <PublicPageHeader {...args} />
    </div>
  ),
};
