import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowTile, type ShowTileShow } from './ShowTile';

const show: ShowTileShow = create(ShowSchema, {
  id: 214,
  artist: 'Redroom Inferno',
  date: '2026-02-14',
  doorsTime: '9:00 PM',
  age: '25+',
  price: '$10 adv / $15 door',
  genre: 'electronic / noise',
  status: ShowStatus.CONFIRMED,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}) as ShowTileShow;
show.kind = 'tickets';
show.poster = 'redroom';

const meta: Meta<typeof ShowTile> = {
  title: 'Public Site/Components/Molecules/ShowTile',
  component: ShowTile,
  tags: ['autodocs'],
  args: { show },
};

export default meta;
type Story = StoryObj<typeof ShowTile>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 270 }}>
      <ShowTile {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: { compact: true },
  render: (args) => (
    <div style={{ width: 220 }}>
      <ShowTile {...args} />
    </div>
  ),
};

export const SoldOut: Story = {
  args: { show: { ...show, kind: 'soldout' } },
  render: (args) => (
    <div style={{ width: 270 }}>
      <ShowTile {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-show-tile-title-color': 'var(--color-text-primary)',
        '--pyxis-show-tile-muted-color': 'var(--color-text-secondary)',
        width: 270,
      } as CSSProperties}
    >
      <ShowTile {...args} />
    </div>
  ),
};
