import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ShowStatus } from 'pyxis-types';
import type { ShowLogEntry } from '../../../../api/appApi';
import { PostShowLogEditorModal } from './PostShowLogEditorModal';

const baseEntry: ShowLogEntry = {
  showId: 1,
  artist: 'Planning for Burial',
  date: '2026-04-26',
  genre: 'Noise / ambient',
  showStatus: ShowStatus.ARCHIVED,
  showNotes: 'Ask about merch table placement before doors. Confirm door split before payout.',
  incident: false,
  logStatus: 'needs-log',
};

const meta: Meta<typeof PostShowLogEditorModal> = {
  title: 'Pyxis App/Components/Organisms/ShowLog/PostShowLogEditorModal',
  component: PostShowLogEditorModal,
  parameters: { layout: 'fullscreen' },
  args: { entry: baseEntry, isOpen: true, onCancel: fn(), onSave: fn() },
};
export default meta;
type Story = StoryObj<typeof PostShowLogEditorModal>;

export const NeedsLog: Story = {};
export const Logged: Story = { args: { entry: { ...baseEntry, draw: 61, postShowNotes: 'Strong turnout, smooth load-out, no issues.', loggedByName: 'Manuel', updatedAt: '2026-04-27T01:00:00Z', logStatus: 'logged' } } };
export const Incident: Story = { args: { entry: { ...baseEntry, draw: 48, incident: true, incidentNotes: 'Neighbor complaint after load-out.', logStatus: 'incident' } } };
export const Saving: Story = { args: { isSaving: true } };
