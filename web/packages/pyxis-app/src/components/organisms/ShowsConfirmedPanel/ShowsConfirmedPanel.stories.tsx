import type { Meta, StoryObj } from '@storybook/react';
import { ShowStatus } from 'pyxis-types';
import { shows } from '../../../api/mockData';
import { ShowsConfirmedPanel } from './ShowsConfirmedPanel';

const confirmed = shows.filter((show) => show.status === ShowStatus.CONFIRMED);

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowsConfirmedPanel',
  component: ShowsConfirmedPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    shows: confirmed,
  },
} satisfies Meta<typeof ShowsConfirmedPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmedPanel: Story = {
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsConfirmedPanel {...args} /></div>,
};

export const Empty: Story = {
  args: {
    shows: [],
  },
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsConfirmedPanel {...args} /></div>,
};

export const Dense: Story = {
  args: {
    shows: [...confirmed, ...confirmed.map((show) => ({ ...show, id: show.id + 100, artist: `${show.artist} late set` }))],
  },
  render: (args) => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsConfirmedPanel {...args} /></div>,
};
