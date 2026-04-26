import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { ShowsFilterBar } from './ShowsFilterBar';
const confirmed = shows.filter((show) => show.status === 'confirmed');
const meta: Meta = { title: 'Pyxis App/Components/Organisms/ShowsFilterBar', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const Filters: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsFilterBar confirmedCount={confirmed.length}/></div> };
