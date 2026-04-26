import type { Meta, StoryObj } from '@storybook/react';
import { settings } from '../../../api/mockData';
import { SettingsToggleRow } from './SettingsToggleRow';
const meta: Meta = { title: 'Pyxis App/Components/Molecules/SettingsToggleRow' };
export default meta;
type Story = StoryObj;
export const SettingsToggleDefault: Story = { render: () => <div style={{ width: 520, padding: 24 }}><SettingsToggleRow label="Discord posting" description="Post approved events to mapped channels." enabled={settings.discordPosting}/></div> };
