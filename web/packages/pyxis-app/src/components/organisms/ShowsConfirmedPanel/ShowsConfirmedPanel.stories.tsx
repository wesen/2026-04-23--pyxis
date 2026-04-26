import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { ShowsConfirmedPanel } from './ShowsConfirmedPanel';
const confirmed = shows.filter((show) => show.status === 'confirmed');
const meta: Meta = { title: 'Pyxis App/Components/Organisms/ShowsConfirmedPanel', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ConfirmedPanel: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsConfirmedPanel shows={confirmed}/></div> };
