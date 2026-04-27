import type { Meta, StoryObj } from '@storybook/react';
import { CalendarEventKind, CalendarEventSchema, create, ShowStatus } from 'pyxis-types';
import { calendarEvents } from '../../../../api/mockData';
import { CalendarMonthPanel } from './CalendarMonthPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/Calendar/CalendarMonthPanel',
  component: CalendarMonthPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    events: calendarEvents,
  },
} satisfies Meta<typeof CalendarMonthPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthPanel: Story = {
  render: (args) => <div style={{ width: 718, padding: 24, background: 'var(--app-canvas)' }}><CalendarMonthPanel {...args} /></div>,
};

export const EmptyMonth: Story = {
  args: {
    events: [],
  },
  render: (args) => <div style={{ width: 718, padding: 24, background: 'var(--app-canvas)' }}><CalendarMonthPanel {...args} /></div>,
};

export const DenseMonth: Story = {
  args: {
    events: [
      ...calendarEvents,
      create(CalendarEventSchema, { id: 301, date: '2025-05-02', label: 'Late DJ set', status: ShowStatus.HOLD, kind: CalendarEventKind.HOLD }),
      create(CalendarEventSchema, { id: 302, date: '2025-05-17', label: 'Afterparty', status: ShowStatus.CONFIRMED, kind: CalendarEventKind.SHOW }),
      create(CalendarEventSchema, { id: 303, date: '2025-05-30', label: 'Volunteer meeting', status: ShowStatus.BLOCKED, kind: CalendarEventKind.BLOCKED }),
    ],
  },
  render: (args) => <div style={{ width: 718, padding: 24, background: 'var(--app-canvas)' }}><CalendarMonthPanel {...args} /></div>,
};

export const Narrow: Story = {
  render: (args) => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><CalendarMonthPanel {...args} /></div>,
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
};
