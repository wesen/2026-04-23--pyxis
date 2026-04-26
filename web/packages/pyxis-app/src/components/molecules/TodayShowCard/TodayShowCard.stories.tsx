import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { TodayShowCard } from './TodayShowCard';
const meta: Meta = { title: 'Pyxis App/Components' };
export default meta;
type Story = StoryObj;
export const TodayShowDefault: Story = { render: () => <div style={{ width: 520, padding: 24 }}><TodayShowCard show={shows[0]}/></div> };
