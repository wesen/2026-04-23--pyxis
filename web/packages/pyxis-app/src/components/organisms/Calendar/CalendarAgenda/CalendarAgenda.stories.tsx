import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents, shows } from '../../../../api/mockData';
import { CalendarAgenda } from './CalendarAgenda';

const meta = {
  title: 'Pyxis App/Components/Organisms/Calendar/CalendarAgenda',
  component: CalendarAgenda,
  parameters: { layout: 'fullscreen' },
  args: {
    events: calendarEvents,
  },
} satisfies Meta<typeof CalendarAgenda>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Agenda: Story = {
  render: (args) => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda {...args} /></div>,
};

export const WithCallbacks: Story = {
  args: {
    onOpenShow: (show) => console.log('open show', show.id),
    onAddToday: () => console.log('add to today'),
  },
  render: (args) => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda {...args} /></div>,
};

export const EmptyMonth: Story = {
  args: {
    events: [],
  },
  render: (args) => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda {...args} /></div>,
};

export const AlternateToday: Story = {
  args: {
    todayShow: shows[2],
  },
  render: (args) => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda {...args} /></div>,
};

export const Narrow: Story = {
  render: (args) => <div style={{ width: 320, padding: 14, background: 'var(--app-mobile-canvas)' }}><CalendarAgenda {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
