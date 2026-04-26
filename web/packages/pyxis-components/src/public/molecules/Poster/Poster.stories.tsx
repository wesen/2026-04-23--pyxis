import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Poster, type PosterKind } from './Poster';

const kinds: PosterKind[] = ['redroom', 'pixel808', 'petals', 'meetups', 'basement', 'orphx', 'moor', 'cygnus', 'zola'];

const meta: Meta<typeof Poster> = {
  title: 'Public Site/Components/Molecules/Poster',
  component: Poster,
  tags: ['autodocs'],
  args: { kind: 'redroom' },
};

export default meta;
type Story = StoryObj<typeof Poster>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 270 }}>
      <Poster {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 18 }}>
      {kinds.map((kind) => (
        <Poster key={kind} kind={kind} />
      ))}
    </div>
  ),
};

export const ThemeOverride: Story = {
  args: { kind: 'redroom' },
  render: (args) => (
    <div style={{ width: 270 }}>
      <Poster
        {...args}
        style={{
          '--pyxis-poster-bg': 'linear-gradient(180deg, #111 0%, #3D0505 100%)',
          '--pyxis-poster-fg': 'var(--color-text-inverse)',
          '--pyxis-poster-accent': 'var(--color-accent)',
        } as CSSProperties}
      />
    </div>
  ),
};
