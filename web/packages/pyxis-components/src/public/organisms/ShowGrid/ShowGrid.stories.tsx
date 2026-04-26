import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowGrid } from './ShowGrid';
import type { ShowTileShow } from '../../molecules/ShowTile';

const makeShow = (show: Partial<ShowTileShow>): ShowTileShow => ({
  ...create(ShowSchema, {
    id: show.id ?? 0,
    artist: show.artist ?? '',
    date: show.date ?? '2026-02-14',
    doorsTime: show.doorsTime ?? '9:00 PM',
    age: show.age ?? '21+',
    price: show.price ?? '$12',
    genre: show.genre ?? 'electronic',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  kind: show.kind ?? 'tickets',
  poster: show.poster,
});

const shows: ShowTileShow[] = [
  makeShow({ id: 1, artist: 'Redroom Inferno', date: '2026-02-14', doorsTime: '9:00 PM', age: '25+', price: '$10 adv / $15 door', poster: 'redroom' }),
  makeShow({ id: 2, artist: '808 Collective', date: '2026-02-21', doorsTime: '8:00 PM', age: '21+', price: '$12', poster: 'pixel808' }),
  makeShow({ id: 3, artist: 'Petals of Love', date: '2026-02-28', doorsTime: '6:30 PM', age: 'All Ages', price: '$15', poster: 'petals' }),
  makeShow({ id: 4, artist: 'Basement Frequencies', date: '2026-02-28', doorsTime: '9:30 PM', age: '21+', price: '$12', poster: 'basement' }),
  makeShow({ id: 5, artist: 'Orphx', date: '2026-07-04', doorsTime: '9:00 PM', age: '18+', price: '$12', poster: 'orphx' }),
  makeShow({ id: 6, artist: 'Zola Jesus', date: '2026-06-06', doorsTime: '8:00 PM', age: '21+', price: '$20', poster: 'zola' }),
];

const meta: Meta<typeof ShowGrid> = {
  title: 'Public Site/Components/Organisms/ShowGrid',
  component: ShowGrid,
  tags: ['autodocs'],
  args: { shows },
};

export default meta;
type Story = StoryObj<typeof ShowGrid>;

export const Desktop: Story = {
  render: (args) => (
    <div style={{ width: 856 }}>
      <ShowGrid {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { compact: true },
  render: (args) => (
    <div style={{ width: 354 }}>
      <ShowGrid {...args} />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-show-tile-title-color': 'var(--color-text-primary)',
        '--pyxis-show-tile-muted-color': 'var(--color-text-secondary)',
        width: 856,
      } as CSSProperties}
    >
      <ShowGrid {...args} />
    </div>
  ),
};
