import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CalendarItemDialog } from './CalendarItemDialog';
const meta = { title: 'Pyxis App/Components/Organisms/Calendar/CalendarItemDialog', component: CalendarItemDialog, parameters: { layout: 'fullscreen' }, args: { mode: 'hold', draft: { date: '2026-06-14', label: 'Hold — TBD', reason: 'Closed' }, onChange: fn(), onCancel: fn(), onSubmit: fn() } } satisfies Meta<typeof CalendarItemDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HoldDialog: Story = { render: (args) => <div style={{ minHeight: 520, background: 'var(--app-canvas)' }}><CalendarItemDialog {...args} /></div> };
export const BlockedDialog: Story = { args: { mode: 'blocked', draft: { date: '2026-06-15', label: 'Hold — TBD', reason: 'Private event' } }, render: (args) => <div style={{ minHeight: 520, background: 'var(--app-canvas)' }}><CalendarItemDialog {...args} /></div> };
export const Saving: Story = { args: { isSaving: true }, render: (args) => <div style={{ minHeight: 520, background: 'var(--app-canvas)' }}><CalendarItemDialog {...args} /></div> };
