import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../../api/mockData';
import { AgeBadge } from '../../../atoms/AgeBadge';
import { DrawProgress } from '../../../atoms/DrawProgress';
import { StatusPill } from '../../../atoms/StatusPill';
import { ShowsTable } from './ShowsTable';

const confirmed = shows.filter((show) => show.status === ShowStatus.CONFIRMED);
const archived = shows.filter((show) => show.status === ShowStatus.ARCHIVED);

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowsTable',
  component: ShowsTable,
  parameters: { layout: 'fullscreen' },
  args: {
    shows: confirmed,
    variant: 'full',
  },
} satisfies Meta<typeof ShowsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsTable {...args} /></div>,
};

export const Dashboard: Story = {
  args: {
    shows: confirmed.slice(0, 5),
    variant: 'dashboard',
  },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowsTable {...args} /></div>,
};

export const Archived: Story = {
  args: {
    shows: archived,
    variant: 'archived',
  },
  render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowsTable {...args} /></div>,
};

export const Empty: Story = {
  args: {
    shows: [],
  },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsTable {...args} /></div>,
};

export const LongContent: Story = {
  args: {
    shows: [{
      ...confirmed[0],
      artist: 'A Very Long Touring Artist Name + Several Guests',
      genre: 'Experimental darkwave and noisy ambient electronics',
      price: '$12 advance / $15 at the door',
    }, ...confirmed.slice(1, 3)],
  },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><ShowsTable {...args} /></div>,
};

export const RowAtoms: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 26, background: 'var(--app-canvas)' }}>
      <AgeBadge>21+</AgeBadge>
      <AgeBadge>All Ages</AgeBadge>
      <StatusPill tone="confirmed">confirmed</StatusPill>
      <DrawProgress value={70} max={150}/>
      <DrawProgress value={160} max={150}/>
    </div>
  ),
};
