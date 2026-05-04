import type { Meta, StoryObj } from '@storybook/react';
import { ExternalEventList } from './ExternalEventList';
import type { ExternalEvent } from 'pyxis-types';
import { create } from '@bufbuild/protobuf';

const meta: Meta<typeof ExternalEventList> = {
  title: 'Public/Organisms/ExternalEventList',
  component: ExternalEventList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExternalEventList>;

const makeEvents = (count: number, calendar = 'Neighbor Venue'): ExternalEvent[] =>
  Array.from({ length: count }, (_, i) =>
    create({
      id: `evt-${i + 1}`,
      calendarId: 'cal-123@group.calendar.google.com',
      calendarName: calendar,
      summary: `Event ${i + 1}: Artist ${String.fromCharCode(65 + i)}`,
      description: '',
      location: i % 2 === 0 ? `${100 + i} Main St` : '',
      start: `2026-05-${String(10 + i).padStart(2, '0')}T${19 + (i % 4)}:00:00-04:00`,
      end: `2026-05-${String(10 + i).padStart(2, '0')}T${22 + (i % 3)}:00:00-04:00`,
      url: 'https://calendar.google.com/event?eid=test',
      isAllDay: false,
    })
  );

export const FewEvents: Story = {
  args: { events: makeEvents(3) },
};

export const ManyEvents: Story = {
  args: { events: makeEvents(8) },
};

export const MixedCalendars: Story = {
  args: {
    events: [
      ...makeEvents(2, 'Neighbor Venue'),
      ...makeEvents(2, 'City Arts Council').map((e, i) => ({
        ...e,
        id: `city-${i + 1}`,
        start: `2026-06-${String(5 + i).padStart(2, '0')}T18:00:00-04:00`,
        end: `2026-06-${String(5 + i).padStart(2, '0')}T21:00:00-04:00`,
      })),
    ],
  },
};

export const Empty: Story = {
  args: { events: [] },
};
