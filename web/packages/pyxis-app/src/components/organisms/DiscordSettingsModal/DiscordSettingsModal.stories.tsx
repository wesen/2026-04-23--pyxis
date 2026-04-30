import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { create, SettingsSchema } from 'pyxis-types';
import { DiscordSettingsModal } from './DiscordSettingsModal';

const settings = create(SettingsSchema, {
  id: 1,
  spaceName: 'Pyxis',
  discordGuildId: '586274407350272042',
  discordChBookings: '1496687000000000001',
  discordChUpcoming: '1496687000000000002',
  discordChAnnouncements: '1496687000000000003',
  discordChStaff: '1496687000000000004',
  discordPosting: true,
  setupComplete: true,
});

const meta: Meta<typeof DiscordSettingsModal> = {
  title: 'Pyxis App/Components/Organisms/DiscordSettingsModal',
  component: DiscordSettingsModal,
  args: {
    isOpen: true,
    settings,
    onCancel: fn(),
    onSave: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DiscordSettingsModal>;

export const Default: Story = {};

export const EmptyChannels: Story = {
  args: {
    settings: create(SettingsSchema, {
      ...settings,
      discordChBookings: '',
      discordChUpcoming: '',
      discordChAnnouncements: '',
      discordChStaff: '',
      discordPosting: false,
    }),
  },
};

export const Saving: Story = {
  args: { isSaving: true },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } },
  args: { settings },
};
