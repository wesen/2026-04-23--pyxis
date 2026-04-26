import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { TodayShowCard } from './TodayShowCard';

const meta = {
  title: 'Pyxis App/Components/Molecules/TodayShowCard',
  component: TodayShowCard,
  args: {
    show: shows[0],
  },
} satisfies Meta<typeof TodayShowCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TodayShowDefault: Story = {
  render: (args) => <div style={{ width: 520, padding: 24 }}><TodayShowCard {...args} /></div>,
};

export const AllAges: Story = {
  args: {
    show: shows[1],
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><TodayShowCard {...args} /></div>,
};

export const OverCapacity: Story = {
  args: {
    show: shows[4],
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><TodayShowCard {...args} /></div>,
};

export const LongContent: Story = {
  args: {
    show: {
      ...shows[0],
      artist: 'A Very Long Touring Artist Name + Several Guests',
      genre: 'Experimental darkwave and noisy ambient electronics',
    },
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><TodayShowCard {...args} /></div>,
};

export const Narrow: Story = {
  render: () => <div style={{ width: 330, padding: 24 }}><TodayShowCard show={shows[0]} /></div>,
};

export const CardList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 520, padding: 24 }}>
      {shows.slice(0, 3).map((show) => <TodayShowCard key={show.id} show={show} />)}
    </div>
  ),
};
