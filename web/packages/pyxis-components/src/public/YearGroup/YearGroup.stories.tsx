import type { Meta, StoryObj } from '@storybook/react';
import { YearGroup } from './YearGroup';
const meta: Meta<typeof YearGroup> = { title: 'Public/YearGroup', component: YearGroup, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof YearGroup>;
export const Default: Story = { args: {} };
