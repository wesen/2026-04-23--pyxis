import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarMonthPanel } from './CalendarMonthPanel';
const meta: Meta = { title: 'Pyxis App/Organisms/Calendar', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const MonthPanel: Story = { render: () => <div style={{ width: 718, padding: 24, background: 'var(--app-canvas)' }}><CalendarMonthPanel events={calendarEvents}/></div> };
