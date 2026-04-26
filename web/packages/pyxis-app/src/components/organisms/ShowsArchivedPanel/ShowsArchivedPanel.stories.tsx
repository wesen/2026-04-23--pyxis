import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { ShowsArchivedPanel } from './ShowsArchivedPanel';
const archived = shows.filter((show) => show.status === 'archived');
const meta: Meta = { title: 'Pyxis App/Organisms/Shows', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const ArchivedPanel: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsArchivedPanel shows={archived}/></div> };
