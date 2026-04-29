import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowStatus } from 'pyxis-types';
import type { ShowLogEntry } from '../../../../api/appApi';
import { PostShowLogPanel, type PostShowLogFilter } from './PostShowLogPanel';

const meta: Meta<typeof PostShowLogPanel> = {
  title: 'Pyxis App/Components/Organisms/ShowLog/PostShowLogPanel',
  component: PostShowLogPanel,
  args: { onSaveEntry: fn() },
};
export default meta;
type Story = StoryObj<typeof PostShowLogPanel>;

const entries: ShowLogEntry[] = [
  { showId: 1, artist: 'Planning for Burial', date: '2026-04-26', genre: 'Noise / ambient', showStatus: ShowStatus.ARCHIVED, showNotes: 'Ask about merch table placement before doors.', incident: false, logStatus: 'needs-log' },
  { showId: 2, showLogId: 2, artist: 'Actress', date: '2026-04-18', genre: 'Experimental / club', showStatus: ShowStatus.ARCHIVED, draw: 61, postShowNotes: 'Strong turnout, smooth load-out, no issues.', incident: false, loggedByName: 'Manuel', updatedAt: '2026-04-19T01:00:00Z', logStatus: 'logged' },
  { showId: 3, showLogId: 3, artist: 'Example Artist', date: '2026-04-12', genre: 'Hardcore / punk', showStatus: ShowStatus.ARCHIVED, draw: 48, postShowNotes: 'Good draw, rough load-out.', incident: true, incidentNotes: 'Neighbor complaint after load-out.', loggedByName: 'Sam', updatedAt: '2026-04-13T01:00:00Z', logStatus: 'incident' },
];

function StatefulPanel(args: Partial<React.ComponentProps<typeof PostShowLogPanel>>) {
  const [filter, setFilter] = useState<PostShowLogFilter>(args.activeFilter ?? 'all');
  const [search, setSearch] = useState(args.search ?? '');
  return <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><PostShowLogPanel entries={entries} {...args} activeFilter={filter} search={search} onFilterChange={setFilter} onSearchChange={setSearch} /></div>;
}

export const Mixed: Story = { render: (args) => <StatefulPanel {...args} /> };
export const NeedsLogOnly: Story = { render: (args) => <StatefulPanel {...args} activeFilter="needs-log" /> };
export const Empty: Story = { args: { entries: [] } };
export const SearchNoResults: Story = { render: (args) => <StatefulPanel {...args} search="zz-no-log" /> };
export const MobileMixed: Story = { render: (args) => <StatefulPanel {...args} />, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
export const EditModalOpen: Story = { render: (args) => <StatefulPanel {...args} />, play: async ({ canvasElement }) => { const { within, userEvent } = await import('@storybook/test'); const canvas = within(canvasElement); await userEvent.click((await canvas.findAllByRole('button', { name: /^Log$/i }))[0]); } };
export const ExpandedDetails: Story = { render: (args) => <StatefulPanel {...args} />, play: async ({ canvasElement }) => { const { within, userEvent, expect } = await import('@storybook/test'); const canvas = within(canvasElement); await userEvent.click((await canvas.findAllByRole('button', { name: /^Details$/i }))[0]); await expect(await canvas.findByText(/No post-show notes yet/i)).toBeInTheDocument(); } };
