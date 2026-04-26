import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../api/mockData';
import { ShowTableRow } from './ShowTableRow';

const meta = {
  title: 'Pyxis App/Components/Molecules/ShowTableRow',
  component: ShowTableRow,
  args: {
    show: shows[0],
    variant: 'full',
  },
} satisfies Meta<typeof ShowTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

function TableFrame({ children, archived = false }: { children: ReactNode; archived?: boolean }) {
  return (
    <div style={{ width: archived ? 760 : 980, padding: 24 }}>
      <table className="app-table">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const Full: Story = {
  render: (args) => <TableFrame><ShowTableRow {...args} /></TableFrame>,
};

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
  },
  render: (args) => <TableFrame><ShowTableRow {...args} /></TableFrame>,
};

export const Archived: Story = {
  args: {
    show: shows.find((show) => show.status === ShowStatus.ARCHIVED) ?? shows[0],
    variant: 'archived',
  },
  render: (args) => <TableFrame archived><ShowTableRow {...args} /></TableFrame>,
};

export const OverCapacity: Story = {
  args: {
    show: shows[4],
  },
  render: (args) => <TableFrame><ShowTableRow {...args} /></TableFrame>,
};

export const LongContent: Story = {
  args: {
    show: {
      ...shows[0],
      artist: 'A Very Long Touring Artist Name + Several Guests',
      genre: 'Experimental darkwave and noisy ambient electronics',
      price: '$12 advance / $15 at the door',
    },
  },
  render: (args) => <TableFrame><ShowTableRow {...args} /></TableFrame>,
};

export const RowSet: Story = {
  render: () => (
    <div style={{ width: 980, padding: 24 }}>
      <table className="app-table">
        <tbody>
          {shows.slice(0, 4).map((show) => <ShowTableRow key={show.id} show={show} />)}
        </tbody>
      </table>
    </div>
  ),
};
