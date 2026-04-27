import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowGrid } from './ShowGrid';
import type { ShowTileShow } from '../../molecules/ShowTile';

const makeShow = (show: Partial<ShowTileShow>): ShowTileShow => ({
  ...create(ShowSchema, {
    id: show.id ?? 0,
    artist: show.artist ?? '',
    date: show.date ?? 'Fri, Feb 14',
    doorsTime: show.doorsTime ?? show.time ?? '9:00 PM',
    age: show.age ?? '21+',
    price: show.price ?? '$12',
    genre: show.genre ?? '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  title: show.title,
  time: show.time,
  kind: show.kind ?? 'tickets',
  poster: show.poster,
});

const prototypeShows: ShowTileShow[] = [
  makeShow({ id: 1, artist: 'Redroom Inferno', title: 'Redroom Inferno', date: 'Fri, Feb 14', time: '9:00 PM', age: '25+', price: '$10 adv / $15 door', poster: 'redroom' }),
  makeShow({ id: 2, artist: '808 Collective', title: '808 Collective', date: 'Fri, Feb 21', time: '8:00 PM', age: '21+', price: '$12', poster: 'pixel808' }),
  makeShow({ id: 3, artist: 'Petals of Love', title: 'Petals of Love', date: 'Sat, Feb 28', time: '6:30 PM', age: 'All Ages', price: '$15', poster: 'petals' }),
  makeShow({ id: 4, artist: 'Monday Meet-Ups', title: 'Monday Meet-Ups', date: 'Every Monday', time: '7:00 PM', age: 'All Ages', price: 'Free — Sliding Scale', kind: 'learn', poster: 'meetups' }),
  makeShow({ id: 5, artist: 'Basement Frequencies', title: 'Basement Frequencies', date: 'Fri, Feb 28', time: '9:30 PM', age: '21+', price: '$12', poster: 'basement' }),
  makeShow({ id: 6, artist: 'Orphx', title: 'Orphx', date: 'Fri, Jul 4', time: '9:00 PM', age: '18+', price: '$12', poster: 'orphx' }),
  makeShow({ id: 7, artist: 'Moor Mother', title: 'Moor Mother', date: 'Fri, May 9', time: '7:00 PM', age: 'All Ages', price: '$15', kind: 'soldout', poster: 'moor' }),
  makeShow({ id: 8, artist: 'Cygnus + Guests', title: 'Cygnus + Guests', date: 'Sat, May 17', time: '9:00 PM', age: '18+', price: '$8', poster: 'cygnus' }),
  makeShow({ id: 9, artist: 'Zola Jesus', title: 'Zola Jesus', date: 'Fri, Jun 6', time: '8:00 PM', age: '21+', price: '$20', poster: 'zola' }),
];

const shows = prototypeShows.slice(0, 6);

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

export const PrototypeDesktop: Story = {
  args: { shows: prototypeShows },
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
