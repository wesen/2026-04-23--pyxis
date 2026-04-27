import type { ComponentProps, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowTile, type ShowTileShow } from './ShowTile';

const makeShow = (show: Partial<ShowTileShow>): ShowTileShow => ({
  ...create(ShowSchema, {
    id: show.id ?? 214,
    artist: show.artist ?? 'Redroom Inferno',
    date: show.date ?? 'Fri, Feb 14',
    doorsTime: show.doorsTime ?? show.time ?? '9:00 PM',
    age: show.age ?? '25+',
    price: show.price ?? '$10 adv / $15 door',
    genre: show.genre ?? '',
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  title: show.title,
  time: show.time,
  kind: show.kind ?? 'tickets',
  poster: show.poster ?? 'redroom',
  ...(show.flyerUrl ? { flyerUrl: show.flyerUrl } : {}),
});

const redroomShow = makeShow({
  id: 1,
  artist: 'Redroom Inferno',
  title: 'Redroom Inferno',
  date: 'Fri, Feb 14',
  time: '9:00 PM',
  age: '25+',
  price: '$10 adv / $15 door',
  poster: 'redroom',
});

const meetupShow = makeShow({
  id: 4,
  artist: 'Monday Meet-Ups',
  title: 'Monday Meet-Ups',
  date: 'Every Monday',
  time: '7:00 PM',
  age: 'All Ages',
  price: 'Free — Sliding Scale',
  kind: 'learn',
  poster: 'meetups',
});

const moorShow = makeShow({
  id: 7,
  artist: 'Moor Mother',
  title: 'Moor Mother',
  date: 'Fri, May 9',
  time: '7:00 PM',
  age: 'All Ages',
  price: '$15',
  kind: 'soldout',
  poster: 'moor',
});

const placeholderFlyerShow = makeShow({
  id: 10,
  artist: 'Placeholder Flyer',
  title: 'Placeholder Flyer',
  flyerUrl: 'https://placehold.co/600x900/C8270D/white?text=Placeholder',
});

const meta: Meta<typeof ShowTile> = {
  title: 'Public Site/Components/Molecules/ShowTile',
  component: ShowTile,
  tags: ['autodocs'],
  args: { show: redroomShow },
};

export default meta;
type Story = StoryObj<typeof ShowTile>;

const renderAtWidth = (width: number) => (args: ComponentProps<typeof ShowTile>) => (
  <div style={{ width }}>
    <ShowTile {...args} />
  </div>
);

export const Default: Story = {
  render: renderAtWidth(270),
};

export const Learn: Story = {
  args: { show: meetupShow },
  render: renderAtWidth(270),
};

export const SoldOut: Story = {
  args: { show: moorShow },
  render: renderAtWidth(270),
};

export const PlaceholderFlyerFallback: Story = {
  args: { show: placeholderFlyerShow },
  render: renderAtWidth(270),
};

export const Compact: Story = {
  args: { compact: true },
  render: renderAtWidth(220),
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
