import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarEventChip } from './CalendarEventChip';

const meta = {
  title: 'Pyxis App/Components/Molecules/CalendarEventChip',
  component: CalendarEventChip,
  args: {
    event: calendarEvents[0],
  },
} satisfies Meta<typeof CalendarEventChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarEventDefault: Story = {
  render: (args) => <div style={{ width: 180, padding: 24 }}><CalendarEventChip {...args} /></div>,
};

export const Hold: Story = {
  args: {
    event: calendarEvents.find((event) => event.status === 'hold') ?? calendarEvents[0],
  },
  render: (args) => <div style={{ width: 180, padding: 24 }}><CalendarEventChip {...args} /></div>,
};

export const Blocked: Story = {
  args: {
    event: calendarEvents.find((event) => event.status === 'blocked') ?? calendarEvents[0],
  },
  render: (args) => <div style={{ width: 180, padding: 24 }}><CalendarEventChip {...args} /></div>,
};

export const LongLabel: Story = {
  args: {
    event: { date: '2025-05-31', label: 'Very Long Artist Name + Guests', status: 'confirmed' },
  },
  render: (args) => <div style={{ width: 180, padding: 24 }}><CalendarEventChip {...args} /></div>,
};

export const EventList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 180, padding: 24 }}>
      {calendarEvents.map((event) => <CalendarEventChip key={`${event.date}-${event.label}`} event={event} />)}
    </div>
  ),
};
