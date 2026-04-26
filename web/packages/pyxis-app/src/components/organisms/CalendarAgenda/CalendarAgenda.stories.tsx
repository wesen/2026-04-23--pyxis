import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarAgenda } from './CalendarAgenda';
const meta: Meta = { title: 'Pyxis App/Components/Organisms/CalendarAgenda', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const Agenda: Story = { render: () => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda events={calendarEvents}/></div> };
