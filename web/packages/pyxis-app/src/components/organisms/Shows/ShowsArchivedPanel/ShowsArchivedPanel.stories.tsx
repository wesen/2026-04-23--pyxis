import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../../api/mockData';
import { ShowsArchivedPanel } from './ShowsArchivedPanel';

const archived = shows.filter((show) => show.status === ShowStatus.ARCHIVED);

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowsArchivedPanel',
  component: ShowsArchivedPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    shows: archived,
  },
} satisfies Meta<typeof ShowsArchivedPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArchivedPanel: Story = {
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsArchivedPanel {...args} /></div>,
};

export const Empty: Story = {
  args: {
    shows: [],
  },
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsArchivedPanel {...args} /></div>,
};

export const Dense: Story = {
  args: {
    shows: [...archived, ...archived.map((show) => ({ ...show, id: show.id + 100, artist: `${show.artist} archive` }))],
  },
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsArchivedPanel {...args} /></div>,
};
