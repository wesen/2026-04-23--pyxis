import type { Meta, StoryObj } from '@storybook/react';
import { ExternalEventCard } from './ExternalEventCard';
import { create, type ExternalEvent, ExternalEventSchema } from 'pyxis-types';

const meta: Meta<typeof ExternalEventCard> = {
  title: 'Public/Molecules/ExternalEventCard',
  component: ExternalEventCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExternalEventCard>;

const makeEvent = (overrides: Partial<ExternalEvent> = {}): ExternalEvent =>
  create(ExternalEventSchema, {
    id: 'evt-1',
    calendarId: 'cal-123@group.calendar.google.com',
    calendarName: 'Neighbor Venue',
    summary: 'Techno Night',
    description: 'A night of heavy beats.',
    location: '123 Main St, Providence RI',
    start: '2026-05-15T20:00:00-04:00',
    end: '2026-05-15T23:00:00-04:00',
    url: 'https://calendar.google.com/event?eid=test',
    isAllDay: false,
    ...overrides,
  });

export const Default: Story = {
  args: { event: makeEvent() },
};

export const AllDay: Story = {
  args: {
    event: makeEvent({
      id: 'evt-2',
      start: '2026-06-20',
      end: '2026-06-21',
      isAllDay: true,
      summary: 'Arts Festival',
    }),
  },
};

export const WithLocation: Story = {
  args: {
    event: makeEvent({
      location: 'The Steel Yard, 27 Sims Ave, Providence RI',
      summary: 'Industrial Jazz Fusion',
    }),
  },
};

export const WithoutCalendarBadge: Story = {
  args: {
    event: makeEvent({ calendarName: '' }),
  },
};

export const WithoutLink: Story = {
  args: {
    event: makeEvent({ url: '' }),
  },
};

export const LongSummary: Story = {
  args: {
    event: makeEvent({
      summary: 'Extremely Long Event Name That Should Truncate Gracefully in the Card Layout Without Breaking',
    }),
  },
};
