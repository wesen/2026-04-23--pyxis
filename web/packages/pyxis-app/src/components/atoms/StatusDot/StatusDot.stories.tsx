import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot } from './StatusDot';
const meta: Meta = { title: 'Pyxis App/Components' };
export default meta;
type Story = StoryObj;
export const StatusDots: Story = { render: () => <div style={{ display: 'flex', gap: 18, padding: 24 }}><StatusDot tone="confirmed"/><StatusDot tone="pending"/><StatusDot tone="declined"/><StatusDot tone="bot"/></div> };
