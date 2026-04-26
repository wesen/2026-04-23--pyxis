import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';
const meta: Meta = { title: 'Pyxis App/Components' };
export default meta;
type Story = StoryObj;
export const MetricCardDefault: Story = { render: () => <div style={{ width: 231 }}><MetricCard label="Upcoming" value={6} caption="Next 60 days" tone="accent"/></div> };
