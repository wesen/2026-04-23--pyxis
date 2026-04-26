import type { Meta, StoryObj } from '@storybook/react';
import { ShowDetailDiscordPanel } from './ShowDetailDiscordPanel';
const meta: Meta = { title: 'Pyxis App/Components/Organisms/ShowDetailDiscordPanel', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const DiscordPanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailDiscordPanel/></div> };
