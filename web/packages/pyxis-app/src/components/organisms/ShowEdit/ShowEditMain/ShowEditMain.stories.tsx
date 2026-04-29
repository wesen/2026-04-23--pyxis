import type { Meta, StoryObj } from '@storybook/react';
import { create, ShowSchema, ShowStatus } from 'pyxis-types';
import { ShowEditMain } from './ShowEditMain';

const show = create(ShowSchema, {
  id: 31,
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
  lineup: [
    { artist: 'YOYOYOYO', role: 'Headline', startTime: '9:00 PM', endTime: '10:00 PM' },
    { artist: 'MASLKJDLASKJ', role: 'Opener', startTime: '10:00 PM', endTime: '11:00 PM' },
  ],
});

const missingOptionalShow = create(ShowSchema, {
  ...show,
  description: '',
  notes: '',
  price: '',
  reserveTicketEnabled: false,
  lineup: [],
});

const meta = {
  title: 'Pyxis App/Components/Organisms/ShowEdit/ShowEditMain',
  component: ShowEditMain,
  parameters: { layout: 'fullscreen' },
  args: { show },
} satisfies Meta<typeof ShowEditMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullShow: Story = { render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowEditMain {...args} /></div> };
export const MissingOptionalData: Story = { args: { show: missingOptionalShow }, render: (args) => <div style={{ width: 760, padding: 24, background: 'var(--app-canvas)' }}><ShowEditMain {...args} /></div> };
export const Narrow: Story = { render: (args) => <div style={{ width: 360, padding: 16, background: 'var(--app-canvas)' }}><ShowEditMain {...args} /></div> };
