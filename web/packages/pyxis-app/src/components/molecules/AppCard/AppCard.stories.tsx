import type { Meta, StoryObj } from '@storybook/react';
import { AppCard } from './AppCard';
import { StatusBadge } from '../StatusBadge';
import { MetadataStrip } from '../MetadataStrip';

const meta: Meta<typeof AppCard> = { title: 'Pyxis App/Components/Molecules/AppCard', component: AppCard };
export default meta;
type Story = StoryObj<typeof AppCard>;

export const Default: Story = { render: () => <AppCard><StatusBadge label="Logged" tone="success" /><h3 style={{ margin: 0 }}>Actress</h3><MetadataStrip items={[{ label: 'Draw', value: 61 }, { label: 'Incident', value: 'No' }]} /></AppCard> };
export const Tones: Story = { render: () => <div style={{ display: 'grid', gap: 12, width: 420 }}><AppCard tone="warning">Warning card</AppCard><AppCard tone="success">Success card</AppCard><AppCard tone="danger">Danger card</AppCard><AppCard tone="muted">Muted card</AppCard></div> };
