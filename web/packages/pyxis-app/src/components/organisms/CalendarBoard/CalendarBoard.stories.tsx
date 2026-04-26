import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarBoard } from './CalendarBoard';
const meta: Meta = { title: 'Pyxis App/Components/Organisms/CalendarBoard', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const BoardDesktop: Story = { render: () => <div style={{ width: 980, padding: 24, background: 'var(--app-canvas)' }}><CalendarBoard events={calendarEvents}/></div> };
export const BoardMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><CalendarBoard events={calendarEvents}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
