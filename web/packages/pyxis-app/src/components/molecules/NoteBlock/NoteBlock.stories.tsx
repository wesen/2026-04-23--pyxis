import type { Meta, StoryObj } from '@storybook/react';
import { NoteBlock } from './NoteBlock';

const meta: Meta<typeof NoteBlock> = { title: 'Pyxis App/Components/Molecules/NoteBlock', component: NoteBlock };
export default meta;
type Story = StoryObj<typeof NoteBlock>;

export const ShowNotes: Story = { args: { label: 'Show notes', value: 'Ask about merch table placement before doors. Confirm door split before payout.' } };
export const Empty: Story = { args: { label: 'Post-show notes', value: '', empty: 'No post-show notes yet.' } };
export const Incident: Story = { args: { label: 'Incident notes', value: 'Neighbor complaint after load-out.', tone: 'danger' } };
