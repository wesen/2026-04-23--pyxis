import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = { title: 'Pyxis App/Components/Molecules/StatusBadge', component: StatusBadge };
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Neutral: Story = { args: { label: 'Draft', tone: 'neutral' } };
export const Tones: Story = { render: () => <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><StatusBadge label="Needs log" tone="warning" /><StatusBadge label="Logged" tone="success" /><StatusBadge label="Incident" tone="danger" /><StatusBadge label="Info" tone="info" /><StatusBadge label="Discord" tone="discord" /></div> };
