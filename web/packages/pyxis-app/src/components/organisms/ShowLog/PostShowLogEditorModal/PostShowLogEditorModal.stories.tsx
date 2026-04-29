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
  showNotes: 'Ask about merch table placement before doors.',
  incident: false,
  logStatus: 'needs-log',
};

const loggedEntry: ShowLogEntry = {
  ...baseEntry,
  draw: 61,
  postShowNotes: 'Strong turnout, smooth load-out, no issues. Artist asked to be routed through again in late summer.',
  loggedByName: 'Manuel',
  updatedAt: '2026-04-27T01:00:00Z',
  logStatus: 'logged',
};

const incidentEntry: ShowLogEntry = {
  ...baseEntry,
  draw: 48,
  postShowNotes: 'Good early crowd, but load-out ran long and needed extra staff attention.',
  incident: true,
  incidentNotes: 'Neighbor complaint after load-out. Door person documented timing and follow-up was assigned to staff chat.',
  logStatus: 'incident',
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
export const Logged: Story = { args: { entry: loggedEntry } };
export const Incident: Story = { args: { entry: incidentEntry } };
export const IncidentChecked: Story = { args: { entry: { ...baseEntry, incident: true, incidentNotes: '' } } };
export const Saving: Story = { args: { entry: loggedEntry, isSaving: true } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const MobileIncidentChecked: Story = { args: { entry: { ...baseEntry, incident: true, incidentNotes: '' } }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
