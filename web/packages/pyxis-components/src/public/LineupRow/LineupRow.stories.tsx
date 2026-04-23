import type { Meta, StoryObj } from '@storybook/react';
import { LineupRow } from './LineupRow';
const meta: Meta<typeof LineupRow> = { title: 'Public/LineupRow', component: LineupRow, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof LineupRow>;
export const Default: Story = { args: {} };
