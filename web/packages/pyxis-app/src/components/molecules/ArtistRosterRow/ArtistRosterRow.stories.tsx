import type { Meta, StoryObj } from '@storybook/react';
import { artists } from '../../../api/mockData';
import { ArtistRosterRow } from '.';

const meta = {
  title: 'Pyxis App/Components/Molecules/ArtistRosterRow',
  component: ArtistRosterRow,
  args: {
    artist: artists[0],
  },
} satisfies Meta<typeof ArtistRosterRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 980, padding: 24 }}>
      <table className="app-table">
        <tbody>
          <ArtistRosterRow {...args} />
        </tbody>
      </table>
    </div>
  ),
};

export const Selected: Story = {
  args: { selected: true },
  render: (args) => (
    <div style={{ width: 980, padding: 24 }}>
      <table className="app-table">
        <tbody>
          <ArtistRosterRow {...args} />
        </tbody>
      </table>
    </div>
  ),
};

export const RowSet: Story = {
  render: () => (
    <div style={{ width: 980, padding: 24 }}>
      <table className="app-table">
        <tbody>
          {artists.slice(0, 5).map((artist) => <ArtistRosterRow key={artist.id} artist={artist} />)}
        </tbody>
      </table>
    </div>
  ),
};
