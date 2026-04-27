import type { Meta, StoryObj } from '@storybook/react';
import { artists } from '../../../api/mockData';
import { ArtistCard } from '.';

const meta = {
  title: 'Pyxis App/Components/Molecules/ArtistCard',
  component: ArtistCard,
  args: {
    artist: artists[0],
  },
} satisfies Meta<typeof ArtistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 420, padding: 24 }}><ArtistCard {...args} /></div>,
};

export const NoAverageDraw: Story = {
  args: {
    artist: artists[0],
  },
  render: (args) => <div style={{ width: 420, padding: 24 }}><ArtistCard {...args} /></div>,
};

export const LongContent: Story = {
  args: {
    artist: {
      ...artists[0],
      name: 'A Very Long Artist Collective Name',
      genre: 'Experimental electronic ambient noise',
      links: 'https://example.com/a-very-long-artist-profile-link',
    },
  },
  render: (args) => <div style={{ width: 420, padding: 24 }}><ArtistCard {...args} /></div>,
};

export const CardList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 420, padding: 24 }}>
      {artists.slice(0, 4).map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
    </div>
  ),
};
