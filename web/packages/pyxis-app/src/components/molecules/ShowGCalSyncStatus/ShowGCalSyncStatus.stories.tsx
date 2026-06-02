import type { Meta, StoryObj } from '@storybook/react';
import { ShowGCalSyncStatus } from './ShowGCalSyncStatus';

const meta = {
  title: 'Pyxis App/Components/Molecules/ShowGCalSyncStatus',
  component: ShowGCalSyncStatus,
} satisfies Meta<typeof ShowGCalSyncStatus>;

export default meta;
type Story = StoryObj<typeof ShowGCalSyncStatus>;

export const Synced: Story = {
  args: {
    synced: true,
    eventId: '3mth06jl639gp0fkj1dothksbo',
    syncedAt: '2026-05-04T18:10:00-04:00',
    onSync: () => alert('Re-sync triggered'),
  },
  render: (args) => (
    <div style={{ width: 480, padding: 24 }}>
      <ShowGCalSyncStatus {...args} />
    </div>
  ),
};

export const NotSynced: Story = {
  args: {
    synced: false,
    onSync: () => alert('Sync triggered'),
  },
  render: (args) => (
    <div style={{ width: 480, padding: 24 }}>
      <ShowGCalSyncStatus {...args} />
    </div>
  ),
};

export const Syncing: Story = {
  args: {
    synced: false,
    isSyncing: true,
  },
  render: (args) => (
    <div style={{ width: 480, padding: 24 }}>
      <ShowGCalSyncStatus {...args} />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    synced: true,
    eventId: '3mth06jl639gp0fkj1dothksbo',
    syncedAt: '2026-05-04T18:10:00-04:00',
    canEdit: false,
  },
  render: (args) => (
    <div style={{ width: 480, padding: 24 }}>
      <ShowGCalSyncStatus {...args} />
    </div>
  ),
};

export const NoEventId: Story = {
  args: {
    synced: true,
    syncedAt: '2026-05-04T18:10:00-04:00',
    onSync: () => alert('Re-sync triggered'),
  },
  render: (args) => (
    <div style={{ width: 480, padding: 24 }}>
      <ShowGCalSyncStatus {...args} />
    </div>
  ),
};
