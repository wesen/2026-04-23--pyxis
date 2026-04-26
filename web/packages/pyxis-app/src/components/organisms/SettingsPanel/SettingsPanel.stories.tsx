import type { Meta, StoryObj } from '@storybook/react';
import { settings } from '../../../api/mockData';
import { SettingsPanel } from './SettingsPanel';

const meta = {
  title: 'Pyxis App/Components/Organisms/SettingsPanel',
  component: SettingsPanel,
  parameters: { layout: 'fullscreen' },
  args: { settings },
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><SettingsPanel {...args} /></div>,
};

export const AllOff: Story = {
  args: { settings: { ...settings, setupComplete: false } },
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><SettingsPanel {...args} /></div>,
};

export const LongSpaceName: Story = {
  args: { settings: { ...settings, spaceName: 'Pyxis Community Arts and Experimental Music Space', address: 'A longer address line for layout stress testing, Providence, RI' } },
  render: (args) => <div style={{ width: 560, padding: 24, background: 'var(--app-canvas)' }}><SettingsPanel {...args} /></div>,
};
