import type { Meta, StoryObj } from '@storybook/react';
import { MetadataStrip } from './MetadataStrip';

const meta: Meta<typeof MetadataStrip> = { title: 'Pyxis App/Components/Molecules/MetadataStrip', component: MetadataStrip };
export default meta;
type Story = StoryObj<typeof MetadataStrip>;

export const Default: Story = { args: { items: [{ label: 'Draw', value: '61' }, { label: 'Incident', value: 'No' }, { label: 'Updated by', value: 'Manuel' }] } };
export const WithTones: Story = { args: { items: [{ label: 'Draw', value: '—', tone: 'muted' }, { label: 'Incident', value: 'Yes', tone: 'danger' }, { label: 'Status', value: 'Needs log', tone: 'warning' }] } };
