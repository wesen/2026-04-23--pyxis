import type { Meta, StoryObj } from '@storybook/react';
import { auditLog } from '../../../api/mockData';
import { ActivityFeedItem } from './ActivityFeedItem';
const meta: Meta = { title: 'Pyxis App/Components/Molecules/ActivityFeedItem' };
export default meta;
type Story = StoryObj;
export const ActivityItemDefault: Story = { render: () => <div style={{ width: 420, padding: 24 }}><ActivityFeedItem item={auditLog[0]}/></div> };
