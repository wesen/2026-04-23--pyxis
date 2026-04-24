import type { Meta, StoryObj } from '@storybook/react';
import { YearGroup } from './YearGroup';
const meta: Meta<typeof YearGroup> = { title: 'Public/Molecules/YearGroup', component: YearGroup, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof YearGroup>;
export const Default: Story = { args: { year: 2024, showCount: 12 } };
