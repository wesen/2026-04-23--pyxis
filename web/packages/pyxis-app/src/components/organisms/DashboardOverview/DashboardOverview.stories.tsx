import type { Meta, StoryObj } from '@storybook/react';
import { auditLog, bookings, shows } from '../../../api/mockData';
import { DashboardOverview } from './DashboardOverview';
const meta: Meta = { title: 'Pyxis App/Components/Organisms/DashboardOverview' };
export default meta;
type Story = StoryObj;
export const DashboardOverviewDefault: Story = { render: () => <div style={{ padding: 24 }}><DashboardOverview shows={shows} bookings={bookings} log={auditLog}/></div> };
