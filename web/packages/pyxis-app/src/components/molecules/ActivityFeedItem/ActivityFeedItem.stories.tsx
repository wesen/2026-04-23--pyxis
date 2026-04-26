import type { Meta, StoryObj } from '@storybook/react';
import { auditLog } from '../../../api/mockData';
import { ActivityFeedItem } from './ActivityFeedItem';

const meta = {
  title: 'Pyxis App/Components/Molecules/ActivityFeedItem',
  component: ActivityFeedItem,
  args: {
    item: auditLog[0],
  },
} satisfies Meta<typeof ActivityFeedItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActivityItemDefault: Story = {
  render: (args) => <div style={{ width: 420, padding: 24 }}><ActivityFeedItem {...args} /></div>,
};

export const Timeline: Story = {
  args: {
    variant: 'timeline',
  },
  render: (args) => <ul style={{ width: 520, padding: 24, margin: 0 }}><ActivityFeedItem {...args} /></ul>,
};

export const BotActivity: Story = {
  args: {
    item: auditLog[1],
  },
  render: (args) => <div style={{ width: 420, padding: 24 }}><ActivityFeedItem {...args} /></div>,
};

export const LongAction: Story = {
  args: {
    item: {
      ...auditLog[0],
      action: 'approved a very detailed show update with longer context, additional notes, and multiple Discord automation side effects',
    },
  },
  render: (args) => <div style={{ width: 420, padding: 24 }}><ActivityFeedItem {...args} /></div>,
};

export const FeedList: Story = {
  render: () => (
    <ul className="app-feed" style={{ width: 420, padding: 24, margin: 0 }}>
      {auditLog.slice(0, 4).map((item) => <ActivityFeedItem key={item.id} item={item} />)}
    </ul>
  ),
};
