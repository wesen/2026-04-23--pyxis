import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowStatus } from 'pyxis-types';
import type { ShowLogEntry } from '../../../../api/appApi';
import { PostShowLogEntryCard } from './PostShowLogEntryCard';

const meta: Meta<typeof PostShowLogEntryCard> = {
  title: 'Pyxis App/Components/Organisms/ShowLog/PostShowLogEntryCard',
  component: PostShowLogEntryCard,
  args: { onToggleExpanded: fn(), onCancel: fn(), onSave: fn() },
};
export default meta;
type Story = StoryObj<typeof PostShowLogEntryCard>;

const baseEntry: ShowLogEntry = {
  showId: 40,
  artist: 'Planning for Burial',
  date: '2026-04-26',
  genre: 'Noise / ambient',
  showStatus: ShowStatus.ARCHIVED,
  showNotes: 'Ask about merch table placement before doors. Confirm door split before payout.',
  incident: false,
  logStatus: 'needs-log',
};

export const NeedsLogCollapsed: Story = { args: { entry: baseEntry } };
export const LoggedCollapsed: Story = { args: { entry: { ...baseEntry, attendanceLogId: 10, artist: 'Actress', date: '2026-04-18', draw: 61, postShowNotes: 'Strong turnout, smooth load-out, no issues.', loggedByName: 'Manuel', updatedAt: '2026-04-19T01:00:00Z', logStatus: 'logged' } } };
export const IncidentCollapsed: Story = { args: { entry: { ...baseEntry, artist: 'Example Artist', date: '2026-04-12', genre: 'Hardcore / punk', draw: 48, incident: true, incidentNotes: 'Neighbor complaint after load-out.', loggedByName: 'Sam', updatedAt: '2026-04-13T01:00:00Z', logStatus: 'incident' } } };
export const ExpandedEditor: Story = { args: { entry: baseEntry, expanded: true } };
export const ValidationError: Story = { args: { entry: { ...baseEntry, incident: true, logStatus: 'incident' }, expanded: true } };
export const Saving: Story = { args: { entry: baseEntry, expanded: true, isSaving: true } };
