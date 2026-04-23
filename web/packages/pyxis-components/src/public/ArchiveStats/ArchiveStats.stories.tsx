import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveStats } from './ArchiveStats';
const meta: Meta<typeof ArchiveStats> = { title: 'Public/ArchiveStats', component: ArchiveStats, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ArchiveStats>;
export const Default: Story = { args: {} };
