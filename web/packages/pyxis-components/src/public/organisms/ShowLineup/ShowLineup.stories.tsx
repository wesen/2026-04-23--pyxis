import type { Meta, StoryObj } from '@storybook/react';
import { create, Show_LineupEntrySchema } from 'pyxis-types';
import { ShowLineup } from './ShowLineup';

const entries = [
  create(Show_LineupEntrySchema, { artist: 'Doors', role: 'dj', startTime: '9:00' }),
  create(Show_LineupEntrySchema, { artist: 'sable witch', role: 'support', startTime: '9:45' }),
  create(Show_LineupEntrySchema, { artist: 'RONE', role: 'headline', startTime: '10:45' }),
  create(Show_LineupEntrySchema, { artist: 'DJ VEILED', role: 'headline', startTime: '12:00' }),
  create(Show_LineupEntrySchema, { artist: 'Close', role: 'dj', startTime: '2:00' }),
];

const meta: Meta<typeof ShowLineup> = {
  title: 'Public Site/Components/Organisms/ShowLineup',
  component: ShowLineup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShowLineup>;

export const Default: Story = {
  args: { entries },
  render: (args) => <div style={{ width: 480 }}><ShowLineup {...args} /></div>,
};

export const FromRtkQueryData: Story = {
  args: {
    entries: entries.map((entry) => ({ ...entry })),
    title: 'Lineup',
  },
  render: (args) => <div style={{ width: 480 }}><ShowLineup {...args} /></div>,
};

export const Empty: Story = {
  args: { entries: [] },
  render: (args) => <div style={{ width: 480 }}><ShowLineup {...args} /></div>,
};
