import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarBoard } from './CalendarBoard';

const meta = {
  title: 'Pyxis App/Components/Organisms/CalendarBoard',
  component: CalendarBoard,
  parameters: { layout: 'fullscreen' },
  args: {
    events: calendarEvents,
  },
} satisfies Meta<typeof CalendarBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoardDesktop: Story = {
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><CalendarBoard {...args} /></div>,
};

export const BoardMobile: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><CalendarBoard {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};

export const Empty: Story = {
  args: {
    events: [],
  },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><CalendarBoard {...args} /></div>,
};

export const Dense: Story = {
  args: {
    events: [
      ...calendarEvents,
      { date: '2025-05-02', label: 'Late DJ set', status: 'hold' },
      { date: '2025-05-17', label: 'Afterparty', status: 'confirmed' },
      { date: '2025-05-30', label: 'Volunteer meeting', status: 'blocked' },
    ],
  },
  render: (args) => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><CalendarBoard {...args} /></div>,
};
