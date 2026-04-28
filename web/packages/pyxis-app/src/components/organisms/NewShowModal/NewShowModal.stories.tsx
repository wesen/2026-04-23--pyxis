import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { NewShowModal } from './NewShowModal';

const meta = { title: 'Pyxis App/Components/Organisms/NewShowModal', component: NewShowModal, parameters: { layout: 'fullscreen' }, args: { onCancel: fn(), onSubmit: fn() } } satisfies Meta<typeof NewShowModal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Saving: Story = { args: { isSaving: true } };
export const BackendError: Story = { args: { error: 'Backend rejected this show because the date is already blocked.' } };
export const EditMode: Story = { args: { mode: 'edit', initialShow: create(ShowSchema, { id: 42, artist: 'Burial Hex', date: '2026-06-14', genre: 'Darkwave', status: ShowStatus.CONFIRMED, capacity: 150, lineup: [] }) } };
export const HoldDraft: Story = { args: { initialShow: create(ShowSchema, { artist: 'Soft hold artist', date: '2026-07-01', status: ShowStatus.HOLD, capacity: 100, lineup: [] }) } };
export const MissingRequiredValidation: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(await canvas.findByRole('button', { name: /^save show$/i })); await expect(await canvas.findByText(/Artist \/ act name is required/i)).toBeInTheDocument(); } };
export const DraftWithoutDateAllowed: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.type(await canvas.findByLabelText(/artist \/ act name/i), 'Draft Without Date'); await userEvent.click(await canvas.findByRole('button', { name: /save draft/i })); } };
