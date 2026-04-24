import type { Meta, StoryObj } from '@storybook/react';
import { ShowTile } from './ShowTile';
const show = { artist: 'Redroom Inferno', date: 'Fri, Feb 14', doors_time: '9:00 PM', age: '25+', price: '$10 adv / $15 door', kind: 'tickets' as const, poster: 'redroom' as const };
const meta: Meta<typeof ShowTile> = { title: 'Public/Molecules/ShowTile', component: ShowTile, tags: ['autodocs'], args: { show } };
export default meta;
type Story = StoryObj<typeof ShowTile>;
export const Default: Story = { render: (args) => <div style={{ width: 270 }}><ShowTile {...args} /></div> };
export const Compact: Story = { args: { compact: true }, render: (args) => <div style={{ width: 220 }}><ShowTile {...args} /></div> };
