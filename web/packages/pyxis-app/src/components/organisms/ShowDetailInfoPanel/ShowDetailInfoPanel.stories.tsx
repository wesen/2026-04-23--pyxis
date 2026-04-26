import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { ShowDetailInfoPanel } from './ShowDetailInfoPanel';
const show = shows[0];
const meta: Meta = { title: 'Pyxis App/Components/Organisms/ShowDetailInfoPanel', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const InfoPanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailInfoPanel show={show}/></div> };
