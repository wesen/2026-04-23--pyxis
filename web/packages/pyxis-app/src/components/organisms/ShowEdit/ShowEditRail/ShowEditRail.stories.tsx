import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowEditRail } from './ShowEditRail';

const show = create(ShowSchema, {
  id: 31,
  artist: 'Redroom Inferno',
  date: '2026-06-14',
  doorsTime: '8:00 PM',
  startTime: '9:00 PM',
  age: '21+',
  price: '$10',
  genre: 'Electronic',
  flyerUrl: '/flyers/show-31/flyer.svg',
  status: ShowStatus.CONFIRMED,
  capacity: 150,
  discordChannelId: 'upcoming-shows',
  discordMessageId: '1234567890',
});

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowEdit/ShowEditRail',
  component: ShowEditRail,
  parameters: { layout: 'fullscreen' },
  args: { show, flyerUrl: '/flyers/show-31/flyer.svg', onUploadFlyer: fn(), onDeleteFlyer: fn(), onAnnounce: fn(), onOpenPost: fn() },
} satisfies Meta<typeof ShowEditRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = { render: (args) => <div style={{ width: 350, padding: 24, background: 'var(--app-canvas)' }}><ShowEditRail {...args} /></div> };
export const NeedsFlyer: Story = { args: { flyerUrl: undefined, show: create(ShowSchema, { ...show, flyerUrl: '', discordMessageId: '' }) }, render: (args) => <div style={{ width: 350, padding: 24, background: 'var(--app-canvas)' }}><ShowEditRail {...args} /></div> };
