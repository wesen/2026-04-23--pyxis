import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../src/api/mockData';
import { CalendarAgenda, CalendarBoard, CalendarMonthPanel } from '../src/components/organisms/Phase8Sections';

const meta: Meta = { title: 'Pyxis App/Organisms/Calendar', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

export const BoardDesktop: Story = { render: () => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><CalendarBoard events={calendarEvents}/></div> };
export const MonthPanel: Story = { render: () => <div style={{ width: 718, padding: 24, background: 'var(--app-canvas)' }}><CalendarMonthPanel events={calendarEvents}/></div> };
export const BoardMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><CalendarBoard events={calendarEvents}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
export const Agenda: Story = { render: () => <div style={{ width: 328, padding: 24, background: 'var(--app-canvas)' }}><CalendarAgenda events={calendarEvents}/></div> };
