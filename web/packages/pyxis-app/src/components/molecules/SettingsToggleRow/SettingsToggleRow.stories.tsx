import type { Meta, StoryObj } from '@storybook/react';
import { settings } from '../../../api/mockData';
import { SettingsToggleRow } from './SettingsToggleRow';

const meta = {
  title: 'Pyxis App/Components/Molecules/SettingsToggleRow',
  component: SettingsToggleRow,
  args: {
    label: 'Discord posting',
    description: 'Post approved events to mapped channels.',
    enabled: settings.discordPosting,
  },
} satisfies Meta<typeof SettingsToggleRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsToggleDefault: Story = {
  render: (args) => <div style={{ width: 520, padding: 24 }}><SettingsToggleRow {...args} /></div>,
};

export const Disabled: Story = {
  args: {
    label: 'Post-show reminders',
    description: 'Remind staff to add attendance notes after completed shows.',
    enabled: false,
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><SettingsToggleRow {...args} /></div>,
};

export const LongDescription: Story = {
  args: {
    label: 'Safer-space agreement',
    description: 'Require agreement text before confirming public bookings and keep the current wording visible to staff during review.',
    enabled: settings.safeSpaceRequired,
  },
  render: (args) => <div style={{ width: 520, padding: 24 }}><SettingsToggleRow {...args} /></div>,
};

export const RowList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 0, width: 520, padding: 24 }}>
      <SettingsToggleRow label="Auto archive past shows" description="Move completed shows to archive after their date." enabled={settings.autoArchive} />
      <SettingsToggleRow label="Discord posting" description="Post approved events and booking activity to mapped channels." enabled={settings.discordPosting} />
      <SettingsToggleRow label="Safer-space agreement" description="Require agreement text before confirming public bookings." enabled={settings.safeSpaceRequired} />
    </div>
  ),
};
