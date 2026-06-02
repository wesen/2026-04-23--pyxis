import type { Meta, StoryObj } from '@storybook/react';
import { GCalSettingsSection } from './GCalSettingsSection';
import type { ExternalCalendarEntry } from './GCalSettingsSection';

const meta = {
  title: 'Pyxis App/Components/Organisms/GCalSettingsSection',
  component: GCalSettingsSection,
  args: {
    enabled: true,
    calendarId: 'pyxis-calendar@group.calendar.google.com',
    externalCalendars: [
      { id: 'neighbor-venue@group.calendar.google.com', name: 'Neighbor Venue', enabled: true },
      { id: 'city-arts@group.calendar.google.com', name: 'City Arts Council', enabled: false },
    ] as ExternalCalendarEntry[],
    canEdit: true,
  },
} satisfies Meta<typeof GCalSettingsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600, padding: 24 }}>
      <GCalSettingsSection {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    enabled: false,
    calendarId: '',
    externalCalendars: [],
  },
  render: (args) => (
    <div style={{ width: 600, padding: 24 }}>
      <GCalSettingsSection {...args} />
    </div>
  ),
};

export const NoExternalCalendars: Story = {
  args: {
    enabled: true,
    calendarId: 'pyxis-calendar@group.calendar.google.com',
    externalCalendars: [],
  },
  render: (args) => (
    <div style={{ width: 600, padding: 24 }}>
      <GCalSettingsSection {...args} />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    enabled: true,
    calendarId: 'pyxis-calendar@group.calendar.google.com',
    canEdit: false,
  },
  render: (args) => (
    <div style={{ width: 600, padding: 24 }}>
      <GCalSettingsSection {...args} />
    </div>
  ),
};

export const ManyCalendars: Story = {
  args: {
    enabled: true,
    calendarId: 'pyxis-calendar@group.calendar.google.com',
    externalCalendars: [
      { id: 'neighbor@group.calendar.google.com', name: 'Neighbor Venue', enabled: true },
      { id: 'city-arts@group.calendar.google.com', name: 'City Arts Council', enabled: true },
      { id: 'underground@group.calendar.google.com', name: 'Underground Collective', enabled: true },
      { id: 'risd-music@group.calendar.google.com', name: 'RISD Music Dept', enabled: false },
      { id: 'prov-punk@group.calendar.google.com', name: 'Providence Punk Shows', enabled: true },
    ] as ExternalCalendarEntry[],
  },
  render: (args) => (
    <div style={{ width: 600, padding: 24 }}>
      <GCalSettingsSection {...args} />
    </div>
  ),
};
