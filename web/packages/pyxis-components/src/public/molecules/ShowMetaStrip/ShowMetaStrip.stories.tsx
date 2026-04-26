import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowMetaStrip } from './ShowMetaStrip';

const meta: Meta<typeof ShowMetaStrip> = {
  title: 'Public Site/Components/Molecules/ShowMetaStrip',
  component: ShowMetaStrip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShowMetaStrip>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 620 }}>
      <ShowMetaStrip {...args} />
    </div>
  ),
};

export const FourItems: Story = {
  args: {
    items: [
      { label: 'Doors', value: '9:00 PM' },
      { label: 'Age', value: '21+' },
      { label: 'Door', value: '$15' },
      { label: 'Venue', value: 'ppxis' },
    ],
  },
  render: (args) => (
    <div style={{ width: 620 }}>
      <ShowMetaStrip {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        '--pyxis-show-meta-strip-accent-color': 'var(--color-text-primary)',
        '--pyxis-show-meta-strip-border-color': 'var(--color-accent)',
        '--pyxis-show-meta-strip-muted-color': 'var(--color-accent)',
        width: 620,
      } as CSSProperties}
    >
      <ShowMetaStrip {...args} />
    </div>
  ),
};
