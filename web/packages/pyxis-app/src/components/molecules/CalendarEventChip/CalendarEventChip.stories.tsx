import type { Meta, StoryObj } from '@storybook/react';
import { calendarEvents } from '../../../api/mockData';
import { CalendarEventChip } from './CalendarEventChip';
const meta: Meta = { title: 'Pyxis App/Components' };
export default meta;
type Story = StoryObj;
export const CalendarEventDefault: Story = { render: () => <div style={{ padding: 24 }}><CalendarEventChip event={calendarEvents[0]}/></div> };
