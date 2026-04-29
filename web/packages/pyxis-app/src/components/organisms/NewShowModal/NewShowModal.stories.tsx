import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { NewShowModal } from './NewShowModal';

const confirmedShowData = {
  id: 42,
  artist: 'Redroom Inferno',
  date: '2026-06-14',
  doorsTime: '8:00 PM',
  startTime: '9:00 PM',
  age: '21+',
  price: '$10',
  genre: 'Electronic',
  description: 'A night of electronic and experimental sounds.',
  notes: 'Load-in at 6pm. Door volunteer needed.',
  flyerUrl: '/flyers/show-31/flyer.svg',
  status: ShowStatus.CONFIRMED,
  capacity: 150,
  reserveTicketEnabled: true,
};

const confirmedShow = create(ShowSchema, {
  ...confirmedShowData,
  lineup: [
    { artist: 'YOYOYOYO', role: 'Headline', startTime: '9:00 PM', endTime: '10:00 PM' },
    { artist: 'MASLKJDLASKJ', role: 'Opener', startTime: '10:00 PM', endTime: '11:00 PM' },
  ],
});

const longLineupShow = create(ShowSchema, {
  ...confirmedShowData,
  lineup: [
    { artist: 'A Very Long Artist Name With Multiple Collaborators', role: 'Headline', startTime: '11:00 PM', endTime: '12:00 AM' },
    { artist: 'Noise Trio', role: 'Direct support', startTime: '10:00 PM', endTime: '10:45 PM' },
    { artist: 'Door Synth Ritual', role: 'Opener', startTime: '9:00 PM', endTime: '9:40 PM' },
  ],
});

const meta = {
  title: 'Pyxis App/Components/Organisms/NewShowModal',
  component: NewShowModal,
  parameters: { layout: 'fullscreen' },
  args: { onCancel: fn(), onSubmit: fn() },
} satisfies Meta<typeof NewShowModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateDefault: Story = {};

export const EditExistingWithFlyer: Story = {
  args: { mode: 'edit', initialShow: confirmedShow },
};

export const ConfirmedNeedsFlyer: Story = {
  args: { initialShow: create(ShowSchema, { artist: 'Needs Poster', date: '2026-07-01', status: ShowStatus.CONFIRMED, capacity: 100, lineup: [] }) },
};

export const LongLineup: Story = {
  args: { mode: 'edit', initialShow: longLineupShow },
};

export const Saving: Story = { args: { isSaving: true, mode: 'edit', initialShow: confirmedShow } };

export const BackendError: Story = { args: { error: 'Backend rejected this show because the date is already blocked.', mode: 'edit', initialShow: confirmedShow } };

export const HoldDraft: Story = { args: { initialShow: create(ShowSchema, { artist: 'Soft hold artist', date: '2026-07-01', status: ShowStatus.HOLD, capacity: 100, lineup: [] }) } };

export const Mobile: Story = {
  args: { mode: 'edit', initialShow: confirmedShow },
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const MissingRequiredValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /^create show$/i }));
    await expect(await canvas.findByText(/Artist \/ act name is required/i)).toBeInTheDocument();
  },
};

export const DraftWithoutDateAllowed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(await canvas.findByLabelText(/artist \/ act name/i), 'Draft Without Date');
    await userEvent.click(await canvas.findByRole('button', { name: /save draft/i }));
  },
};
